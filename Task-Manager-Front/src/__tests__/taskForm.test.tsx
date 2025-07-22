import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskForm from "../components/taskForm";
import { Priority } from "../types/priority";
import { Status } from "../types/status";
import '@testing-library/jest-dom/vitest';

describe("TaskForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();
  const user = userEvent.setup();
  
  it("renders new task form correctly", () => {
    render(<TaskForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    expect(screen.getByText("New Task")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Task Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Task Description")).toBeInTheDocument();
    expect(screen.getByText("Select time")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("renders edit task form with initial values", () => {
    const initialTask = {
      id: "1",
      title: "Test Task",
      description: "Test description",
      status: Status.PENDING,
      priority: Priority.High,
      dueDate: "2025-12-31T14:30:00.000Z"
    };
    
    render(<TaskForm onSubmit={mockOnSubmit} onClose={mockOnClose} initialTask={initialTask} />);
    
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test description")).toBeInTheDocument();
    expect(screen.getByText("14:30")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  it("opens time selector when time button is clicked", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const timeButton = screen.getByText("Select time");
    await user.click(timeButton);
    
    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(screen.getByText("12:30")).toBeInTheDocument();
  });

  it("selects time and closes dropdown", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const timeButton = screen.getByText("Select time");
    await user.click(timeButton);
    
    const timeOption = screen.getByText("09:30");
    await user.click(timeOption);
    
    expect(screen.getByText("09:30")).toBeInTheDocument();
    expect(screen.queryByText("00:00")).not.toBeInTheDocument();
  });

  it("closes time selector when clicking outside", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const timeButton = screen.getByText("Select time");
    await user.click(timeButton);
    
    expect(screen.getByText("00:00")).toBeInTheDocument();
    
    // Click outside the time selector
    await user.click(document.body);
    
    await waitFor(() => {
      expect(screen.queryByText("00:00")).not.toBeInTheDocument();
    });
  });

  it("displays selected time on button", async () => {
    const taskWithTime = {
      id: "1",
      title: "Test",
      description: "Test",
      status: Status.PENDING,
      priority: Priority.High,
      dueDate: "2025-12-31T14:30:00.000Z"
    };
    
    render(<TaskForm onSubmit={mockOnSubmit} onClose={mockOnClose} initialTask={taskWithTime} />);
    
    expect(screen.getByText("14:30")).toBeInTheDocument();
  });

  it("submits form with correct data", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const titleInput = screen.getByPlaceholderText("Task Title");
    const descriptionInput = screen.getByPlaceholderText("Task Description");
    
    await user.type(titleInput, "New Task");
    await user.type(descriptionInput, "New task description");
    
    // Select priority
    const priorityButton = screen.getByText("Medium");
    await user.click(priorityButton);
    
    const submitButton = screen.getByText("Create");
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: "New Task",
      description: "New task description",
      status: Status.PENDING,
      priority: Priority.Medium,
      dueDate: undefined
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("closes form when Cancel is clicked", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});