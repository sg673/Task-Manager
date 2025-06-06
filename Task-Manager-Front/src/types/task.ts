import { Priority } from "./priority";

export interface Task{
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority : Priority
    dueDate?: string; // ISO format
    projectId?: string;
}



export enum SortKey {
    Priority = "priority",
    DueDate = "dueDate",
    Title = "title"
}

