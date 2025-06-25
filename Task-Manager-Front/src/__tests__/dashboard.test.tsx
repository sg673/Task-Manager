import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../pages/dashboard";
import { getTasks, addTask, deleteTask, updateTask } from "../services/api";
import { Priority } from "../types/priority";
import { Status } from "../types/status";
import { SortKey } from "../types/task";
import '@testing-library/jest-dom/vitest';

// Mock the API
vi.mock("../services/api");
vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockTasks = [
  {
    id: "1",
    title: "Test Task 1",
    description: "Test description 1",
    status: Status.PENDING,
    priority: Priority.High,
    dueDate: "2025-12-31T23:59:00.000Z",
  },
  {
    id: "2",
    title: "Test Task 2",
    description: "Test description 2",
    status: Status.IN_PROGRESS,
    priority: Priority.Low,
    dueDate: "2026-01-15T10:00:00.000Z",
  },
];

describe("Dashboard", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.mocked(getTasks).mockResolvedValue(mockTasks);
    vi.mocked(addTask).mockResolvedValue(true);
    vi.mocked(deleteTask).mockResolvedValue(true);
    vi.mocked(updateTask).mockResolvedValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders dashboard header", async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Manage your tasks efficiently")).toBeInTheDocument();
    });
  });

  it("shows loading state initially", async () => {
    render(<Dashboard />);
    const loadingText = screen.getByText("Loading Tasks...");
    await waitFor(() => {
      expect(loadingText).toBeInTheDocument();
    });
  });

  it("loads and displays tasks", async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
      expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    });
    
    expect(getTasks).toHaveBeenCalled();
  });

  it("displays no tasks message when empty", async () => {
    vi.mocked(getTasks).mockResolvedValue([]);
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText("No Tasks Found. Create One!")).toBeInTheDocument();
    });
  });

  it("renders New Task button", async () => {
    render(<Dashboard />);
    const newTaskButton = screen.getByText("+ New Task");

    await waitFor(() => {
      expect(newTaskButton).toBeInTheDocument();
    });
  });

  it("renders sort dropdown with correct options",async () => {
    render(<Dashboard />);
    const sortSelect = screen.getByDisplayValue("Sort by: Due Date");
    expect(sortSelect).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(sortSelect);

    });

    //await act(async () => {
    //  await user.click(cancelButton);
    //});
    expect(screen.getByText("Sort by: Priority")).toBeInTheDocument();
    expect(screen.getByText("Sort by: Title")).toBeInTheDocument();
  });

  it("opens task form when New Task button is clicked", async () => {
    render(<Dashboard />);
    
    const newTaskButton = screen.getByText("+ New Task");

      await user.click(newTaskButton);
    expect(screen.getByText("New Task")).toBeInTheDocument();
  });

  it("displays task information correctly", async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
      expect(screen.getByText("Test description 1")).toBeInTheDocument();
      expect(screen.getByText("Priority: High")).toBeInTheDocument();
      expect(screen.getByText("PENDING")).toBeInTheDocument();
    });
  });

  it("shows Edit and Delete buttons for each task", async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      const editButtons = screen.getAllByText("Edit");
      const deleteButtons = screen.getAllByText("Delete");
      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });
  });

  it("opens edit form when Edit button is clicked", async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getAllByText("Edit")).toHaveLength(2);
    });
    
    const editButtons = screen.getAllByText("Edit");
    await user.click(editButtons[0]);
    
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
  });

  it("deletes task when Delete button is clicked", async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getAllByText("Delete")).toHaveLength(2);
    });
    
    const deleteButtons = screen.getAllByText("Delete");
  
    await user.click(deleteButtons[0]);
    
    expect(deleteTask).toHaveBeenCalledWith("1");
  });

  it("sorts tasks by title", async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });
    
    const sortSelect = screen.getByDisplayValue("Sort by: Due Date");
    await act(async () => {
      await user.selectOptions(sortSelect, SortKey.Title);
    });
    
    expect(sortSelect).toHaveValue(SortKey.Title);
  });

  it("sorts tasks by priority", async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });
    
    const sortSelect = screen.getByDisplayValue("Sort by: Due Date");
    await act(async () => {
      await user.selectOptions(sortSelect, SortKey.Priority);
    });
    
    expect(sortSelect).toHaveValue(SortKey.Priority);
  });

  it("formats long titles with ellipsis", async () => {
    const longTitleTask = {
      ...mockTasks[0],
      title: "This is a very long title that should be truncated with ellipsis",
    };
    vi.mocked(getTasks).mockResolvedValue([longTitleTask]);
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/This is a very long title/)).toBeInTheDocument();
    });
  });

  it("displays time left for tasks with due dates", async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      // Should show some time indication (days or hours left)
      expect(screen.getAllByText(/left|Past Due/)[0]).toBeInTheDocument();
    });
  });

  it("handles API error gracefully", async () => {
    vi.mocked(getTasks).mockRejectedValue(new Error("API Error"));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.queryByText("Loading Tasks...")).not.toBeInTheDocument();
    });
    //consoleSpy.mockRestore();
  });

  it("closes task form when Cancel is clicked", async () => {
    render(<Dashboard />);
    
    const newTaskButton = screen.getByText("+ New Task");
    await user.click(newTaskButton);
    expect(screen.getByText("New Task")).toBeInTheDocument();
    
    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);
  
    expect(screen.queryByText("New Task")).not.toBeInTheDocument();
  });

  it("closes edit form when Cancel is clicked", async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getAllByText("Edit")).toHaveLength(2);
    });
    
    const editButtons = screen.getAllByText("Edit");
    await act(async () => {
      await user.click(editButtons[0]);
    });
    
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    
    const cancelButton = screen.getByText("Cancel");
    await act(async () => {
      await user.click(cancelButton);
    });
    
    expect(screen.queryByText("Edit Task")).not.toBeInTheDocument();
  });
});