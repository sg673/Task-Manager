import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    return(
        <div className="max-w-xl mx-auto p-4 bg-gray-100">
            <h1>Register</h1>
            <form className="bg-white shadow rounded-lg p-6" method="POST" action="/api/register">
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">First Name:</label>
                    <input type="text" id="firstname" name="firstname" required className="w-full px-3 py-2 border rounded-md bg-gray-50"/>
                </div>
                <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">Last Name:</label>
                    <input type="text" id="lastname" name="lastname" required className="w-full px-3 py-2 border rounded-md bg-gray-50"/>
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
                    <input type="text" id="username" name="username" required className="w-full px-3 py-2 border rounded-md bg-gray-50"/>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                    <input type="email" id="email" name="email" required className="w-full px-3 py-2 border rounded-md bg-gray-50"/>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                    <input type="password" id="password" name="password" required className="w-full px-3 py-2 border rounded-md bg-gray-50"/>
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required className="w-full px-3 py-2 border rounded-md bg-gray-50"/>
                </div>
                <div className="flex gap-2 justify-end">
                    <button 
                        type="submit"
                         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:scale-110 transition"
                    >
                        Register
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