import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
    const [formData,setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors,setErrors] = useState<Record<string,string>>({});
    const [isLoading,setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateField = (name:string, value:string) => {
        const newErrors = {...errors};
        switch(name){
            case "password":
                newErrors.password = (value.length < 8 || value.length > 20) ? "Password must be between 8 and 20 characters":"";
                break;
            case "confirmPassword":
                newErrors.confirmPassword = value !== formData.password ? "Passwords do not match":"";
        }
        setErrors(newErrors);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        const {name,value} = e.target;
        setFormData({ ...formData,[e.target.name]: e.target.value});
        validateField(name,value);
    }

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        if(formData.password !== formData.confirmPassword){
            toast.error("Passwords dont match");
            return;
        }
        setIsLoading(true);
        const success = await registerUser();
        setIsLoading(false);
        if(success){
            toast.success("Registration Successful");
            navigate("/login");
        }
        else{
            toast.error("Registration Failed :(");
        }

    }

    return(
        <div className="max-w-xl mx-auto p-4 bg-gray-100">
            <h1>Register</h1>
            <form className="bg-white shadow rounded-lg p-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">First Name:</label>
                    <input
                        type="text" 
                        id="firstname" 
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        required 
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                </div>
                <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">Last Name:</label>
                    <input 
                        type="text" 
                        id="lastname" 
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange} 
                        required
                         className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username"
                        value={formData.username}
                        onChange={handleChange} 
                        required 
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                </div>
                <div>
                    {/**Password Must be between 8 and 20 chars */}
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange} 
                        required 
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                    {errors.password && 
                    <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                    </p>}
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password:</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required 
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                     {errors.confirmPassword && 
                    <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword}
                    </p>}
                </div>
                <div className="flex gap-2 justify-end">
                    <button 
                        type="submit"
                        disabled={isLoading}
                         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:scale-110 transition"
                    >
                        {isLoading ? "Creating Account..." : "Register"}
                    </button>
                    <button
                            type="button" 
                            onClick={() => navigate("/login")}
                            
                            className=" bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 hover:scale-110 transition"
                        >
                           Login
                        </button>
                </div>
            </div>
            </form>
        </div>
    );
}