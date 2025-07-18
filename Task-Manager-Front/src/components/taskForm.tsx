import { useState, useRef, useEffect } from "react";
import { Task } from "../types/task";
import { Priority } from "../types/priority";
import { Status } from "../types/status";

interface TaskFormProps{
    onSubmit: (task:Omit<Task,"id">) => void;
    onClose: () => void;
    initialTask? : Task;
}

/**
 * Form component for creating and editing tasks
 * 
 * @param {TaskFormProps} props - Component props
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Function} props.onClose - Function to call when form is closed
 * @param {Task} [props.initialTask] - Initial task data for editing mode
 * @returns {JSX.Element} The rendered form
 */
export default function TaskForm({onSubmit,onClose,initialTask}: TaskFormProps){
    const [title, setTitle] = useState(initialTask?.title ?? "");
    const [description, setDescription] = useState(initialTask?.description ?? "");
    const [priority, setPriority] = useState<Priority>(initialTask?.priority ?? Priority.None);
    const [dueDate, setDueDate] = useState(initialTask?.dueDate?.split('T')[0] ?? "");
    const [dueTime, setDueTime] = useState(initialTask?.dueDate ? 
        initialTask.dueDate.split('T')[1].substring(0, 5) : "");
    const [showTimeSelector, setShowTimeSelector] = useState(false);
    
    // Generate time options in 30-minute intervals
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
        for (const minute of [0, 30]) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            timeOptions.push(`${formattedHour}:${formattedMinute}`);
        }
    }
    
    const timeSelectorRef = useRef<HTMLDivElement>(null);
    
    // Close time selector when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (timeSelectorRef.current && !timeSelectorRef.current.contains(event.target as Node)) {
                setShowTimeSelector(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /**
     * Handles form submission, formats the date/time, and calls the onSubmit callback
     * 
     * @param {React.FormEvent} e - The form submission event
     */
    function handleSubmit(e:React.FormEvent){
        e.preventDefault();
        let dueDateTimeISO;
        if (dueDate) {
            const dateTimeString = dueTime ? `${dueDate}T${dueTime}:00` : `${dueDate}T00:00:00`;
            dueDateTimeISO = new Date(dateTimeString).toISOString();
        }
        
        onSubmit({
            title,
            description,
            status: Status.PENDING,
            priority,
            dueDate: dueDateTimeISO
        });
        onClose();
    }

    return(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl"
            >
                <h2 className="text-xl font-semibold mb-4"> {initialTask ? "Edit Task" : "New Task"}</h2>
                {/**Title */}
                <label className="block mb-2">
                    <span className="text-sm text-gray-700 font-semibold">Title</span>
                    <input
                        className="mt-1 w-full border border-gray-300 rounded px-3 py2"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task Title"
                    />
                </label>
                {/**Description */}
                <label className="block mb-2">
                    <span className="text-sm text-gray-700 font-semibold">Description</span>
                    <textarea
                        className="mt-1 w-full border border-gray-300 rounded px-3 py2"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Task Description"
                    />
                </label>
                {/**Due Date and Time */}
                <div className="block mb-2">
                    <span className="text-sm text-gray-700 font-semibold">Due Date & Time</span>
                    <div className="flex gap-2 mt-1">
                        <input
                            type="date"
                            className="flex-1 border border-gray-300 rounded px-3 py-2"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                        <div className="relative" ref={timeSelectorRef}>
                            <button
                                type="button"
                                className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-700"
                                onClick={() => setShowTimeSelector(!showTimeSelector)}
                            >
                                {dueTime || "Select time"}
                            </button>
                            
                            {showTimeSelector && (
                                <div className="absolute right-0 mt-1 w-26 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-10">
                                    {/* Fade effect at top */}
                                    <div className="sticky top-0 h-6 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
                                    
                                    <div className="px-2 py-1">
                                        {timeOptions.map(time => (
                                            <div 
                                                key={time} 
                                                className="px-2 py-1 cursor-pointer hover:bg-blue-100 rounded text-sm"
                                                onClick={() => {
                                                    setDueTime(time);
                                                    setShowTimeSelector(false);
                                                }}
                                            >
                                                {time}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Fade effect at bottom */}
                                    <div className="sticky bottom-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/**Priority */}
                <label className="block mb-4">
                    <span className="text-sm text-gray-700 font-semibold mb-1 block">Priority</span>
                    <div className="flex flex-wrap gap-2 px-6">
                       {Object.values(Priority).map((priorityValue) => (
                            <button
                                key={priorityValue}
                                type="button"
                                className={`px-3 py-1.5 text-sm rounded-md border transition ${
                                    priority === priorityValue ?
                                    "bg-blue-600 text-white border-blue-600" :
                                    "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                }`}
                                onClick={() => setPriority(priorityValue)}
                            >{priorityValue}</button>
                        ))}
                    </div>

                </label>
                {/**Action buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 hover:scale-110 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:scale-110 transition"
                    >
                        {initialTask ? "Save Changes" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
}