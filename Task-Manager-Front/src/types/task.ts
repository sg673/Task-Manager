import { Priority } from "./priority";
import { Status } from "./status";

export interface Task{
    id: string;
    title: string;
    description?: string;
    status: Status;
    priority : Priority
    dueDate?: string; // ISO format
    projectId?: string;
}



export enum SortKey {
    Priority = "priority",
    DueDate = "dueDate",
    Title = "title"
}

