import { Task } from "../types/task";
import { getPriorityBg } from "../types/priority";
import { MAX_DESC_LENGTH, MAX_TITLE_LENGTH } from "../types/constants";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

/**
 * TaskCard component that displays a single task
 * 
 * @param {TaskCardProps} props - The component props
 * @returns {JSX.Element} The rendered task card
 */
export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  /**
   * Calculates and formats the time remaining until a due date
   * 
   * @param {string} [dueDate] - The due date in ISO format
   * @returns {string} Formatted time remaining string
   */
  function getTimeLeft(dueDate?: string): string {
    if (!dueDate) return "No Due Date";
    const diff = new Date(dueDate).getTime() - Date.now();
    if (diff <= 0) return "Past Due";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    return days > 0 ? `${days}d left` : `${hours}h left`;
  }

  /**
   * Truncates description text if it exceeds maximum length
   * 
   * @param {string} desc - The description text
   * @returns {string} Truncated description with ellipsis if needed
   */
  function formatDesc(desc: string): string {
    if (desc) {
      return (desc.length > MAX_DESC_LENGTH) ? desc.slice(0, MAX_DESC_LENGTH) + "..." : desc;
    }
    return "";
  }

  /**
   * Truncates title text if it exceeds maximum length
   * 
   * @param {string} title - The title text
   * @returns {string} Truncated title with ellipsis if needed
   */
  function formatTitle(title: string): string {
    if (title) {
      return (title.length > MAX_TITLE_LENGTH) ? title.slice(0, MAX_TITLE_LENGTH) + "..." : title;
    }
    return "";
  }

  return (
    <div
      className={`shadow-md rounded-2xl p-4 flex flex-col justify-between ${getPriorityBg(task.priority)}`}
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">{formatTitle(task.title)}</h3>
        {task.description && (
          <p className="text-gray-700 mb-3 text-sm break-words">{formatDesc(task.description)}</p>
        )}
        <p className="text-xs text-gray-500 mb-2 capitalize">
          Priority: {task.priority}
        </p>
        {task.dueDate && (
          <p className="text-xs text-gray-500 mb-1 italic">
            {getTimeLeft(task.dueDate)}
          </p>
        )}
      </div>
      
      <div className="mt-auto flex items-center justify-between">
        <p className="text-xs text-gray-500 mb-1 mx-1 italic">
          {task.status as string}
        </p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition hover:scale-105"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition hover:scale-105"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}