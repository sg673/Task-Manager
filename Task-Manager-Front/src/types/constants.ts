import { createContext } from "react";
import { AuthContextType } from "../contexts/authContext";

export const MAX_DESC_LENGTH = 85;
export const MAX_TITLE_LENGTH = 30;

export const AuthContext = createContext<AuthContextType | undefined>(undefined);