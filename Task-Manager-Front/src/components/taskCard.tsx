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
   * 
   * @param {string} - The string to be formatted
   * @param {maxLength} - The maximum length of the string 
   */
  function formatString(string:string, maxLength:number):string{
    return (string.length > maxLength) ? string.slice(0,maxLength) + "..." : string;
  }

  return (
    <div
      className={`shadow-md rounded-2xl p-4 flex flex-col justify-between ${getPriorityBg(task.priority)}`}
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">{formatString(task.title,MAX_TITLE_LENGTH)}</h3>
        {task.description && (
          <p className="text-gray-700 mb-3 text-sm break-words">{formatString(task.description,MAX_DESC_LENGTH)}</p>
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