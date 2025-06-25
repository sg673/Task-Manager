import { useEffect, useState } from "react";
import { getUser, updateUser } from "../services/api";
import {User} from "../types/user";
import toast from "react-hot-toast";

export default function Profile(){
    const [user,setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({});

    useEffect(() => {
        async function loadProfile(){
            try{
                const userData = await getUser();
                setUser(userData);
                setFormData(userData);
            }
            catch(error){
                toast.error("Failed to load profile");
                console.error("Failed to load profile", error);
            }
            finally{
                setIsLoading(false);
            }

        }

        loadProfile();
    },[]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!user) return;

        try {
            await updateUser({...formData} as User);
            setUser({ ...user, ...formData });
            setIsEditing(false);
            toast.success("Profile updated successfully");
        }
        catch (error) {
            toast.error("Failed to update profile");
            console.error("Failed to update profile", error);
            return;
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }
    if(isLoading){
        return (
            <div className="flex justify-center p-8">
                Loading Profile...
            </div>
        )
    }
    return(
        <div className="max-w-4x1 mx-auto p-4">
            <h1 className="text-2x1 font-bold mb-6">User Profile</h1>
            {!isEditing ? (
                <div className="bg-white shadown rounded-lg p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                            <img
                                src={user?.avatar || "https://via.placeholder.com/150"}
                                alt="User Avatar"
                                className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0"
                            />
                        </div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
                            <p className="text-gray-600 mb-2">Username: {user?.username}</p>
                            <p className="text-gray-600 mb-2">Email: {user?.email}</p>
                            <p className="text-gray-600 mb-2">Bio: {user?.bio || "No bio Given"}</p>
                            <p className="text-gray-600 mb-4">Joined: {new Date(user?.createdAt || "").toLocaleDateString()}</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 transition"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input 
                                type="text"
                                name="firstName"
                                value={formData.firstName || user?.firstName || ""}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded=md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input 
                                type="text"
                                name="lastName"
                                value={formData.lastName || user?.lastName || ""}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded=md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input 
                                type="text"
                                name="username"
                                value={formData.username || user?.username || ""}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded=md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input 
                                type="email"
                                name="email"
                                value={formData.email || user?.email || ""}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded=md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                            <input 
                                type="text"
                                name="avatar"
                                value={formData.avatar || user?.avatar || ""}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded=md"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea 
                                name="bio"
                                value={formData.bio || user?.bio || ""}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded=md"
                                rows={3}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 transition"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 hover:scale-110 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}