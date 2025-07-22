import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../components/taskCard';
import { Priority } from '../types/priority';
import { Status } from '../types/status';
import '@testing-library/jest-dom/vitest';

describe('TaskCard Component', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'This is a test task description',
    status: Status.PENDING,
    priority: Priority.Medium,
    dueDate: new Date(Date.now() + 86410000).toISOString() // Tomorrow
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders task information correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task description')).toBeInTheDocument();
    expect(screen.getByText(/Priority: Medium/i)).toBeInTheDocument();
    expect(screen.getByText(/1d left/i)).toBeInTheDocument();
    expect(screen.getByText(Status.PENDING)).toBeInTheDocument();
  });

  it('handles user interactions correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);

    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('truncates long title and description', () => {
    const longTask = {
      ...mockTask,
      title: 'This is a very long task title that should be truncated in the display',
      description: 'This is a very long task description that should be truncated in the display. It contains a lot of text to ensure that the truncation functionality works correctly.'
    };

    render(
      <TaskCard 
        task={longTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText(/This is a very long task title/)).toBeInTheDocument();
    expect(screen.getByText(/This is a very long task description/)).toBeInTheDocument();
    expect(screen.getAllByText(/\.\.\./)).toHaveLength(2);
  });
});