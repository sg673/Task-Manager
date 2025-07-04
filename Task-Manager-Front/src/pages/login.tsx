import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login(){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e:React.FormEvent){
        e.preventDefault();
        const success = await login(username,password);
        if(success){
            toast.success("Login Successful");
            navigate("/dashboard");
        }
        else{
            toast.error("Invalid Credentials");
        }
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:scale-110 transition"    
                >
                    Login
                </button>
            </form>
        </div>

    );
}