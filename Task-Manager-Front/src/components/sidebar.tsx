import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Project } from "../types/project";
import { getProjects } from "../services/api";
import { Folder, Plus, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Sidebar component that displays navigation and project list
 * 
 * @returns {JSX.Element} The rendered sidebar
 */
export default function Sidebar() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectData = await getProjects();
        setProjects(projectData);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        toast.error("Failed to load Projects :(")
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const toggleProjects = () => {
    setIsProjectsOpen(!isProjectsOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg"
        onClick={toggleMobileSidebar}
      >
        <Folder size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 h-screen fixed top-0 left-0 pt-16 transition-all duration-300 z-40 ${
          isMobileOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4">
          <div className="mb-6">
            <button
              onClick={() => navigate("/dashboard")}
              className={`flex items-center w-full px-3 py-2 rounded-md ${
                location.pathname === "/dashboard"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-sm font-medium">Dashboard</span>
            </button>
          </div>

          <div className="mb-2">
            <div
              className="flex items-center justify-between px-3 py-2 cursor-pointer"
              onClick={toggleProjects}
            >
              <span className="text-sm font-medium text-gray-700">Projects</span>
              {isProjectsOpen ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </div>

            {isProjectsOpen && (
              <div className="mt-1 ml-2">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 size={18} className="animate-spin text-indigo-600" />
                  </div>
                ) : projects.length === 0 ? (
                  <p className="text-xs text-gray-500 px-3 py-2">No projects yet</p>
                ) : (
                  <div className="space-y-1">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className={`flex items-center w-full px-3 py-2 rounded-md text-sm ${
                          location.pathname === `/projects/${project.id}`
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: project.color || "#CBD5E1" }}
                        />
                        <span className="truncate">{project.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => navigate("/projects/new")}
                  className="flex items-center w-full px-3 py-2 mt-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Plus size={16} className="mr-2 text-gray-500" />
                  <span>New Project</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate("/profile")}
              className={`flex items-center w-full px-3 py-2 rounded-md ${
                location.pathname === "/profile"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-sm font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}