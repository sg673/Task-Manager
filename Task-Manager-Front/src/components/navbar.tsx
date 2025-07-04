
import {Link, useLocation, useNavigate} from "react-router-dom";
import { Menu,X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const navLinks = [
    {label: "Dashboard", path:"/dashboard"},
    {label: "Projects", path:"/projects"},
    {label: "Profile", path:"/profile"}
];

export default function Navbar(){
    const location = useLocation();
    const [menuOpen,setMenuOpen] = useState(false);
    const {logout} = useAuth();
    const navigate = useNavigate();

    function toggleMenu(){
        setMenuOpen((prev) => !prev);
    }

    function handleLogout(){
        logout();
        navigate("/login");
        
    }

    return (
        <nav className="bg-gray-100 shadow-sm px-6 py-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                {/**BRAND */}
                <Link
                    to="/"
                    className="text-xl font-bold text-blue-600"
                >
                Task Manager</Link>

                {/**Navlinks Desktop */}
                <div className="hidden md:flex gap-6 items-center">
                    {navLinks.map((link) =>(
                        <Link
                        key={link.path}
                        to={link.path}
                        className={`text-sm font-medium transition 
                            ${location.pathname === link.path ? "text-blue-600"
                                : "text-gray-600 hover:text-blue-500"
                            }`}
                        >{link.label}</Link>
                    ))}

                    <button
                    onClick={handleLogout}
                     className="ml-4 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded"
                     >Logout</button>
                </div>

                {/**navlinks mobile (hamburger) */}
                <div className="relative">
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-gray-600 focus:outline-none"
                    >
                        {menuOpen ? <X size={24}/> : <Menu size={24}/>}
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-11 bg-white shadow-md rounded-md md:hidden mt-2 space-y-2 px-4 pb-4 w-48">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={()=> setMenuOpen(false)}
                                    className={`block text-sm font-medium ${location.pathname === link.path ? "text-blue-600" : "text-gray-700 hover:text-blue-500"}`}
                                >{link.label}</Link>
                            ))}
                            <button
                                
                                className="block text-left text-sm w-full bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded"
                                onClick={() => {
                                    setMenuOpen(false)
                                    handleLogout();
                                }
                            }
                            >Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>

    );
}