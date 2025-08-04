import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Project from '../pages/project';
import * as api from '../services/api';
import userEvent from '@testing-library/user-event';

// Mock the API module
vi.mock('../services/api', () => ({
  getProjectById: vi.fn(),
  getTasksByProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
  addTask: vi.fn(),
  getProjects: vi.fn()
}));

// Mock useParams and useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ projectId: '1' }),
    useNavigate: () => vi.fn()
  };
});

describe('Project Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    vi.mocked(api.getProjectById).mockResolvedValue({
      id: '1',
      name: 'Test Project',
      description: 'Test Description',
      color: '#4f46e5',
      createdAt: '2023-01-01T00:00:00.000Z'
    });
    
    vi.mocked(api.getTasksByProject).mockResolvedValue([]);
    vi.mocked(api.addTask).mockResolvedValue(true);
  });

  it('displays project details after loading', async () => {
    render(
      <BrowserRouter>
        <Project />
      </BrowserRouter>
    );
    
    // Wait for the project to load
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('displays "No tasks" message when project has no tasks', async () => {
    render(
      <BrowserRouter>
        <Project />
      </BrowserRouter>
    );
    
    // Wait for the project to load
    await waitFor(() => {
      expect(screen.getByText('No tasks in this project yet.')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Create your first task')).toBeInTheDocument();
  });

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Project />
      </BrowserRouter>
    );
    
    // Wait for the project to load
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
    
    // Find and click the edit button
    const editButton = screen.getByTitle('Edit Project');
    await user.click(editButton);
    
    // Check if edit form is displayed
    expect(screen.getByText('Edit Project')).toBeInTheDocument();
    expect(screen.getByLabelText('Project Name')).toHaveValue('Test Project');
    expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
  });

  it('opens TaskForm when Add Task button is clicked', async () => {
  const user = userEvent.setup();
  
  render(
    <BrowserRouter>
      <Project />
    </BrowserRouter>
  );
  
  await waitFor(() => {
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });
  
  const addTaskButton = screen.getByText('Add Task');
  await user.click(addTaskButton);
  
  expect(screen.getByText('New Task')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Task Title')).toBeInTheDocument();
});

  it('creates task with correct project ID when TaskForm is submitted', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Project />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
    
    const addTaskButton = screen.getByText('Add Task');
    await user.click(addTaskButton);
    
    const titleInput = screen.getByPlaceholderText('Task Title');
    await user.type(titleInput, 'New Test Task');
    
    const createButton = screen.getByText('Create');
    await user.click(createButton);
    
    await waitFor(() => {
      expect(api.addTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Test Task',
          projectId: '1'
        })
      );
    });
  });

});