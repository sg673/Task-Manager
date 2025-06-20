import { Task } from "../types/task";
import { Priority } from "../types/priority";
import { Status } from "../types/status";

//MOCK API TO SIMULATE DATA
const mockTasks: Task[] = [
    {
        id:"1",
        title: "Buy groceries",
        description: "Milk, bread, eggs, and butter",
        status: Status.PENDING,
        priority: Priority.None,
        dueDate: "2025-07-01T00:30:00.000Z" 
    },
    {
        id: "2",
        title: "Finish project report",
        status:Status.IN_PROGRESS,
        priority: Priority.Critical,
        dueDate: "2025-06-29T00:30:00.000Z"
    },
];

//MOCK API CALLS
//800ms delay added to all returns to simulate network delay


export async function getTasks(): Promise<Task[]> {
    return new Promise((resolve) =>{
        setTimeout(() => resolve(mockTasks),800);
    })
}

export async function addTask(newTask: Task) : Promise<boolean> {
    return new Promise((resolve) => {
        mockTasks.push(newTask);
        setTimeout(() => resolve(true), 800);
    })
}

export async function updateTask(updatedTask: Task): Promise<boolean> {
    return new Promise((resolve) => {
        const index = mockTasks.findIndex((task) => task.id === updatedTask.id);
        if (index !== -1) {
            mockTasks[index] = updatedTask;
            setTimeout(() => resolve(true), 800);
        }
        setTimeout(() => resolve(false), 800);
    })
}

export async function deleteTask(taskId: string): Promise<boolean> {
    return new Promise((resolve) => {
        const index = mockTasks.findIndex((task) => task.id === taskId);
        if (index !== -1) {
            mockTasks.splice(index, 1);
            setTimeout(() => resolve(true), 800);
        }
        setTimeout(() => resolve(false), 800);
    })
}