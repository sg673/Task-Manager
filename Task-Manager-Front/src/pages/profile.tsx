import { useEffect, useState } from "react";
import { getUser } from "../services/api";
import {User} from "../types/user";

export default function Profile(){
    const [user,setUser] = useState<User | null>(null);

    useEffect(() => {
        async function loadProfile(){
            try{
                const userData = await getUser();
                setUser(userData);
            }
            catch(error){
                console.error("Failed to load profile", error);
                
                
            }
        }

        loadProfile();
    },[]);
    return(
        <div className="max-w-4x1 mx-auto p-4">
            <h1 className="text-2x1 font-bold mb-6">User Profile</h1>
            
            
        </div>
    );
}