import { Task } from "../types/task";
import { Priority } from "../types/priority";

//MOCK API TO SIMULATE DATA
const mockTasks: Task[] = [
    {
        id:"1",
        title: "Buy groceries",
        description: "Milk, bread, eggs, and butter",
        completed: false,
        priority: Priority.None,
        dueDate: "2025-07-01"
    },
    {
        id: "2",
        title: "Finish project report",
        completed: true,
        priority: Priority.Critical,
        dueDate: "2025-06-29"
    },
];

export async function getTasks(): Promise<Task[]> {
    return new Promise((resolve) =>{
        //simulate network delay
        setTimeout(() => resolve(mockTasks),800);
    })
}