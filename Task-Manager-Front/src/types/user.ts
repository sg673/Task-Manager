export interface User {
    id: string;
    username: string;
    email: string;
    password: string; // HASH THIS
    createdAt: string; // ISO format
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string; // Link to avatar picture
}