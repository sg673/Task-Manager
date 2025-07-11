import { useEffect,useState } from "react";
import  { SortKey, Task } from "../types/task";
import { Priority,getPriorityBg } from "../types/priority";
import { addTask, deleteTask, getTasks, updateTask } from "../services/api";
import TaskForm from "../components/taskForm";
import { toast } from "react-hot-toast";
import { MAX_DESC_LENGTH, MAX_TITLE_LENGTH } from "../types/constants";

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

    function sortedTasks(): Task[]{
        const priorityOrder = Object.values(Priority);
        return [...tasks].sort((a,b) => {
            if(sortKey === SortKey.Title) return a.title.localeCompare(b.title);
            if(sortKey === SortKey.Priority) return priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority)
            if(sortKey === SortKey.DueDate) return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
            return 0; // Default case, no sorting
        });
    }

    function getTimeLeft(dueDate?: string) : string {
        if(!dueDate) return "No Due Date";
        const diff = new Date(dueDate).getTime() - Date.now();
        if(diff <= 0) return "Past Due";
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        return days > 0 ? `${days}d left` : `${hours}h left`;

    }

    function formatDesc(desc : string) : string{
        if(desc){
            return (desc.length > MAX_DESC_LENGTH) ? desc.slice(0,MAX_DESC_LENGTH) + "..." : desc;
        }
        return "";
    }

    function formatTitle(title : string) : string{
        if(title){
            return (title.length > MAX_TITLE_LENGTH) ? title.slice(0,MAX_TITLE_LENGTH) + "..." : title;
        }
        return "";
    }

    async function handleCreateTask(task:Omit<Task,"id">) {
        const newTask : Task = {
            ...task,
            id: crypto.randomUUID(), // USE BACKEND ID WHEN MADE
        };
        return await addTask(newTask) ? toast.success("Task Created!") : toast.error("Failed to create task");
        //setTasks([...prev,newTask])
    }

    async function handleDeleteTask(id : string){
        setTasks(tasks.filter((t) => t.id !== id))
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        await deleteTask(id) ? toast.success("Task deleted successfully") : toast.error("Failed to delete task");
        return;
        /*try {
            setTasks(tasks.filter((t) => t.id !== id));
            toast.success("Task deleted successfully");
        } catch (error) {
            console.error("Failed to delete task", error);
            toast.error("Failed to delete task");
        }*/
    }
    
    async function handleUpdateTask(task:Task){
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        await updateTask(task) ? toast.success("Task updated successfully") : toast.error("Failed to update task");
        setEditingTask(null);
        return;
    }
    
    /*const handleUpdateTask = (updatedTask : Task) => {
        setTasks((prev) => 

        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
        setEditingTask(null);
    };*/
    

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
                        
                                <div
                                    key={task.id}
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
                                                {task.status as string }
                                            </p>
                                        <div className="flex gap-2">
                                            <button
                                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition hover:scale-105"
                                                onClick={() => setEditingTask(task)}
                                           >
                                            Edit
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition hover:scale-105"
                                                onClick={() => handleDeleteTask(task.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
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