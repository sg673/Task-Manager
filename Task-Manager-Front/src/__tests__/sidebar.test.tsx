import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import * as api from '../services/api';

// Mock the API module
vi.mock('../services/api', () => ({
  getProjects: vi.fn()
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/dashboard' })
  };
});

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sidebar with loading state initially', () => {
    // Mock the API response
    vi.mocked(api.getProjects).mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('displays projects after loading', async () => {
    // Mock the API response
    const mockProjects = [
      {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        color: '#4f46e5',
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ];
    
    vi.mocked(api.getProjects).mockResolvedValue(mockProjects);
    
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    // Wait for the projects to load
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
    
    expect(screen.getByText('New Project')).toBeInTheDocument();
  });

  it('displays "No projects yet" when no projects are available', async () => {
    // Mock empty projects array
    vi.mocked(api.getProjects).mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    // Wait for the projects to load
    await waitFor(() => {
      expect(screen.getByText('No projects yet')).toBeInTheDocument();
    });
  });
});