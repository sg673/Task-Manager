import { Task } from "../types/task";
import { Priority } from "../types/priority";
import { Status } from "../types/status";
import { User } from "../types/user";

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

const mockUser: User = {
  id: "1",
  username: "johndoe",
  email: "john.doe@example.com",
  // amazonq-ignore-next-line
  password: "password",  //HASH
  firstName: "John",
  lastName: "Doe",
  avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAACUCAMAAADmiEg1AAAAMFBMVEXk5ueutLfg4uSnrrHn6eqqsbSxt7rS1dfW2dva3d7Hy82/xMa7wMPKztDq7O3CxskpgEGPAAAETElEQVR4nO2c25KkIAxAuQQExOb//3bRvk1v28olEqzyPM1O1VadoWKIkMjYxcXFxcXFxcXFxcUFHQDUBlkAE8KayYUQ3DQZK8QJ/gAAMTivlVQPJNfeDZ2rw80ErZXiH8R/+9H0aw5gNP+JNn2KAzNa/tbmXGpD7bgCWK+2rOd4kcF2t+aT3tOezfXQmfi4L33H36hV/yBSFvu55ILa9oVNlV7QvQT5VvZbXfE+xG2e9iJO7RwRmdYL1NKR5CfyL57amo1F3jzQWsNUZB1jfCDVzn4m31B6s92a5PeCE26cMGwWgNtIuroWyq05YU6BqThKFshqwyrrGOE0FVZxDqRe8PJk8ljwkcIaTO1yc04SKJVP5bzgE4G28PXrrQkC3FbsOU9ke21Ws1e+vNtnFKjNJgtj8yIFMLS5bl9cIYQJJ8iEBse7dVFYW1M9af1g3gKOt2vtjbDrzIzn9FbNvctfiD+8/Tm9+eXd1Lt9nCDlk+beyRcj27TOJ+Bw9p2ptfdwzn3+rHXVaevYurPBJ+3fG6DwouEDFdq/75z0vZhZhPWmOIeoPh7k7XfLhfo3NUlxObXZ3JMIzQF49TkyzSXmac/toS5QaI7tWX1tRXYvVbfgJEnw7l1TFErK7pnyIoWiNHlT3FegNKH1/GiWrjdpH0cULzzfdLTahTlF0fcpMZbe8/jSprj/+8LmiistevDObVbqpe8xs4Wwk9VegIxQ8V0NDITExW5+obOHSetb727IAUSQO+ZKun5C+83OhINSvkdrtszB+K/hnae0HnvJfitEc+f5//GiJPfOdpVGvgAQZhi1ko9BLymlHgfb+ZzXGzFMk1vG6qhNMoCFW+T+E7XPHoujEMJaY4Y7xtiIYL3qx+UFYQcXRu+91vNQ4ML8o/Z+DG4wgt36ko/OdhpnQz67rqXB+ZfxD3BGxOCh9mXzFGDc4p2Xe3vl6w+IOXEQ9/9HJx1DY/rO1/vu87qTqQNb22RS3X2gGd69senXpp6ornUwjWN9rkQw7ouVbnmMAmLYnsjNQGpn20R6tPZlQb2OiubHiwNMviaq182DPfiQE+MyahV3aLBYjxXX/6P4cJQ5MMeRI+TD3B8T5kipb0NcTwcsORy62A9z9DdnyJg0rxFHbpAAi537foF7xFJ9M5wO4tQaJB7+IYljHTPjTI7kmOOIt9aO4ginn6K9Nsq3aSi068+bUbrtisyrsgqEo+qoQ8WxhnSKKL+aPazYTqP4KrxNTfKbws9GlbYMoFEW4lUfUcDxLutkIrbmZW2/WAMMVeR/Mwryvu10ECr/dpn6obyTW9MSp+4XKjeJ9xDdM5kRXvRRqiPIaxEnLUw+yWrFquw0xiSrHRXj2w9IqIxPGnQUJjznQ1dYw6w4pL+ydZNNFpL3zPJm3SNIH1UHR+36QfLBG9lL/DrpNQrSzDMSyWcpFR/nO4TEt4dYesuuSJ6dFp2xovgPOvI9e4LYmyIAAAAASUVORK5CYII=",
  bio: "Task management enthusiast",
  createdAt: "2023-01-15T00:00:00.000Z"
};

//MOCK API CALLS
//800ms delay added to all returns to simulate network delay


/**
 * Retrieves all tasks from the API
 * 
 * @returns {Promise<Task[]>} Promise that resolves with an array of tasks
 */
export async function getTasks(): Promise<Task[]> {
    return new Promise((resolve) =>{
        setTimeout(() => resolve(mockTasks),800);
    })
}

/**
 * Adds a new task to the system
 * 
 * @param {Task} newTask - The task to add
 * @returns {Promise<boolean>} Promise that resolves with success status
 */
export async function addTask(newTask: Task) : Promise<boolean> {
    return new Promise((resolve) => {
        mockTasks.push(newTask);
        setTimeout(() => resolve(true), 800);
    })
}

/**
 * Updates an existing task
 * 
 * @param {Task} updatedTask - The task with updated data
 * @returns {Promise<boolean>} Promise that resolves with success status
 */
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

/**
 * Deletes a task by ID
 * 
 * @param {string} taskId - The ID of the task to delete
 * @returns {Promise<boolean>} Promise that resolves with success status
 */
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

//User calls
/**
 * Retrieves the current user's information
 * 
 * @returns {Promise<User>} Promise that resolves with user data
 */
export async function getUser(): Promise<User> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockUser), 800);
    });
}
/**
 * Updates the current user's information
 * 
 * @param {User} updatedUser - The user data with updates
 * @returns {Promise<boolean>} Promise that resolves with success status
 */
export async function updateUser(updatedUser: User): Promise<boolean> {
    return new Promise((resolve) => {
       Object.assign(mockUser, updatedUser);
        setTimeout(() => resolve(true), 800);
    });
}

export async function registerUser():Promise<boolean>{
    return new Promise((resolve) =>{
        setTimeout(() => resolve(true),800);
    });
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
        if (username == mockUser.username && password == mockUser.password){
            setTimeout(() => resolve(true), 800);
        }
        else{
            setTimeout(() => resolve(false), 800);
        }
    })
}