import { useEffect, useState } from "react";
import { SortKey, Task } from "../types/task";
import { Priority } from "../types/priority";
import { addTask, deleteTask, getTasks, updateTask } from "../services/api";
import TaskForm from "../components/taskForm";
import TaskCard from "../components/taskCard";
import { toast } from "react-hot-toast";

/**
 * Dashboard page component that displays and manages tasks
 * 
 * @returns {JSX.Element} The rendered dashboard page
 */
export default function Dashboard(){
    const [tasks,setTasks] = useState<Task[]>([]);
    const [loading,setLoading] = useState(true);
    const [showForm,setShowForm] = useState(false);
    const [editingTask,setEditingTask] = useState<Task | null>(null);
    const [sortKey,setSortKey] = useState<SortKey>(SortKey.DueDate);


    //Loading tasks from memory
    useEffect(() =>{
        async function fetchTasks(){
            try{
                const data = await getTasks();
                setTasks(data);
            } catch(error){
                console.error("Failed to load tasks",error);
                toast.error("Failed to load tasks");
            } finally{
                setLoading(false);
            }

        }
        fetchTasks();
    },[tasks]);

    /**
     * Returns a sorted copy of the tasks array based on the current sort key
     * 
     * @returns {Task[]} Sorted array of tasks
     */
    function sortedTasks(): Task[]{
        const priorityOrder = Object.values(Priority);
        return [...tasks].sort((a,b) => {
            if(sortKey === SortKey.Title) return a.title.localeCompare(b.title);
            if(sortKey === SortKey.Priority) return priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority);
            else return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime(); // Order by date by default
        });
    }

    /**
     * Handles task creation by generating an ID and calling the API
     * 
     * @param {Omit<Task,"id">} task - The task data without ID
     * @returns {Promise<void>} Promise that resolves when task is created
     */
    async function handleCreateTask(task:Omit<Task,"id">) {
        const newTask : Task = {
            ...task,
            id: crypto.randomUUID(), // USE BACKEND ID WHEN MADE
        };
        return await addTask(newTask) ? toast.success("Task Created!") : toast.error("Failed to create task");
    }

    /**
     * Handles task deletion by removing it from state and calling the API
     * 
     * @param {string} id - The ID of the task to delete
     * @returns {Promise<void>} Promise that resolves when task is deleted
     */
    async function handleDeleteTask(id : string){
        setTasks(tasks.filter((t) => t.id !== id))
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        await deleteTask(id) ? toast.success("Task deleted successfully") : toast.error("Failed to delete task");
        return;
    }
    
    /**
     * Handles task updates by calling the API and clearing edit mode
     * 
     * @param {Task} task - The updated task data
     * @returns {Promise<void>} Promise that resolves when task is updated
     */
    async function handleUpdateTask(task:Task){
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        await updateTask(task) ? toast.success("Task updated successfully") : toast.error("Failed to update task");
        setEditingTask(null);
        return;
    }    

    return(
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4x1 mx-auto">
                <header className="mb-6">
                    <h1 className="text-3x1 font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600">Manage your tasks efficiently</p>
                </header>

                <div className="flex justify-end mb-4">

                    <button 
                        onClick={() =>setShowForm(true)}
                        className="px-4 py-2 mx-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-110 transition">
                        + New Task
                    </button>
                    {/**Sort feature */}
                    <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value as SortKey)}
                        className="border rounded-lg px-3 py-1 text-sm hover:bg-gray-200 hover:scale-105"
                    >
                        <option value={SortKey.DueDate}>Sort by: Due Date</option>
                        <option value={SortKey.Priority}>Sort by: Priority</option>
                        <option value={SortKey.Title}>Sort by: Title</option>
                    </select>
                </div>

                {loading ? (
                    <p className="text-gray-500">Loading Tasks...</p>
                ) : tasks.length === 0 ? (
                    <p className="text-gray-500">No Tasks Found. Create One!</p>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {sortedTasks().map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={setEditingTask}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </div>
                )}
            </div>
            {editingTask && (
                <TaskForm
                    initialTask={editingTask}
                    onSubmit={(partialUpdate) =>
                        handleUpdateTask({...editingTask,...partialUpdate})
                    }
                    onClose={() => setEditingTask(null)}
                ></TaskForm>
            )}
            {showForm && (
                <TaskForm onSubmit={handleCreateTask} onClose={() => setShowForm(false)}/>
            )}
        </div>
    );
}