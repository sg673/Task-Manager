import { useState } from "react";
import { Task } from "../types/task";
import { Priority } from "../types/priority";

interface TaskFormProps{
    onSubmit: (task:Omit<Task,"id">) => void;
    onClose: () => void;
    initialTask? : Task;
}

const priorityOptions = [
    { label: "None", value: Priority.None },
  { label: "Low", value: Priority.Low },
  { label: "Medium", value: Priority.Medium },
  { label: "High", value: Priority.High },
  { label: "Critical", value: Priority.Critical }
];
export default function TaskForm({onSubmit,onClose,initialTask}: TaskFormProps){
    const [title, setTitle] = useState(initialTask?.title ?? "");
    const [description, setDescription] = useState(initialTask?.description ?? "");
    const [priority, setPriority] = useState<Priority>(initialTask?.priority ?? Priority.None);

    function handleSubmit(e:React.FormEvent){
        e.preventDefault();
        onSubmit({title,description,completed:initialTask?.completed ?? false,priority});
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
                    />
                </label>
                {/**Priority */}
                <label className="block mb-4">
                    <span className="text-sm text-gray-700 font-semibold mb-1 block">Priority</span>
                    <div className="flex flex-wrap gap-2 px-6">
                        {priorityOptions.map((opt) => (
                            <button
                                key = {opt.value}
                                type="button"
                                className={`px-3 py-1.5 text-sm rounder border transition ${
                                    priority === opt.value ?
                                    "bg-blue-600 text-white border-blue-600" :
                                    "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                }`}
                                onClick={() => setPriority(opt.value)}
                            >{opt.label}</button>
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