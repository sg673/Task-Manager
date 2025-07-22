import { ReactNode, useEffect, useState } from "react";
import { User } from "../types/user";
import { getUser, validateCredentials } from "../services/api";
import { AuthContext } from "../types/constants";

export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user,setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData(){
            const token = localStorage.getItem("authToken");
            if (token) {
                setUser(await getUser())
            }
            setIsLoading(false);

        }
        fetchData();
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        const ans =  await validateCredentials(username,password);
        if(ans) {
            setUser(await getUser());
            localStorage.setItem("authToken","true")
            return true;
        }
        return false;
    };
        
    const logout = async () => {
        setUser(null);
        localStorage.removeItem("authToken");
    };
    return (
        <AuthContext.Provider value={{user,login,logout,isLoading}}>
            {children}
        </AuthContext.Provider>
    );

}

