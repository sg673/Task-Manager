/**
 * Represents a project in the task management system
 */
export interface Project {
    id: string;
    name: string;
    description?: string;
    color?: string;
    createdAt: string; // ISO format
    updatedAt?: string; // ISO format
}