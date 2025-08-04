import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Project as ProjectType } from "../types/project";
import { Task } from "../types/task";
import { getProjectById, getTasksByProject, deleteProject, updateProject, addTask } from "../services/api";
import { Loader2, Edit2, Trash2, Plus } from "lucide-react";
import TaskCard from "../components/taskCard";
import toast from "react-hot-toast";
import TaskForm from "../components/taskForm";

/**
 * Project page component that displays project details and associated tasks
 * 
 * @returns {JSX.Element} The rendered project page
 */
export default function Project() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    color: ""
  });
  const [showTaskForm,setShowTaskForm] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (projectId === "new") {
        setProject({
          id: "",
          name: "New Project",
          description: "",
          color: "#4f46e5",
          createdAt: new Date().toISOString()
        });
        setTasks([]);
        setLoading(false);
        setIsEditing(true);
        return;
      }

      try {
        setLoading(true);
        if (projectId) {
          const projectData = await getProjectById(projectId);
          if (projectData) {
            setProject(projectData);
            setEditForm({
              name: projectData.name,
              description: projectData.description || "",
              color: projectData.color || "#4f46e5"
            });
            
            const projectTasks = await getTasksByProject(projectId);
            setTasks(projectTasks);
          }
        }
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (project) {
      setEditForm({
        name: project.name,
        description: project.description || "",
        color: project.color || "#4f46e5"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const handleSave = async () => {
    if (!project) return;
    
    const updatedProject: ProjectType = {
      ...project,
      name: editForm.name,
      description: editForm.description,
      color: editForm.color,
      updatedAt: new Date().toISOString()
    };

    try {
      await updateProject(updatedProject);
      setProject(updatedProject);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const handleDelete = async () => {
    if (!project?.id) return;
    
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(project.id);
        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    navigate(`/task/${task.id}`);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        // Remove the task from the local state
        setTasks(tasks.filter(task => task.id !== taskId));
        // In a real app, you would call an API to delete the task
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleCreateTask = async (task: Omit<Task,"id">) => {
    try {
      const newTask = {...task,id:Date.now().toString()};
      await addTask(newTask);
      setTasks([...tasks,newTask]);
      toast.success("Task Created");
    } catch(error){
      console.error("Failed to create task:",error)
      toast.error("Failed to create task")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={24} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Project not found</h1>
        <p className="mt-2 text-gray-600">The project you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {isEditing ? (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">
            {projectId === "new" ? "Create New Project" : "Edit Project"}
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={editForm.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={editForm.color}
                  onChange={handleInputChange}
                  className="w-10 h-10 border-0 p-0"
                />
                <input
                  type="text"
                  value={editForm.color}
                  onChange={handleInputChange}
                  name="color"
                  className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => projectId === "new" ? navigate("/dashboard") : setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: project.color || '#CBD5E1' }}
              />
              <h1 className="text-2xl font-bold">{project.name}</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEditToggle}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full"
                title="Edit Project"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full"
                title="Delete Project"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          {project.description && (
            <p className="mt-2 text-gray-600">{project.description}</p>
          )}
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus size={16} className="mr-1" />
            Add Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">No tasks in this project yet.</p>
            <button
              onClick={() => setShowTaskForm(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create your first task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={handleEditTask} 
                onDelete={handleDeleteTask} 
              />
            ))}
          </div>
        )}
      </div>
      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onClose={() => setShowTaskForm(false)}
          defaultProjectId={project.id}
        />
      )}
    </div>
  );
}