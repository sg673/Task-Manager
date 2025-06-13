export enum Priority {
    None = "None",
    Low = "Low",
    Medium = "Medium",
    High = "High",
    Critical = "Critical"
}

export function getPriorityBg(priority : Priority): string {
    switch(priority){
        case Priority.Critical:
            return "bg-red-100";
        case Priority.High:
            return "bg-orange-100";
        case Priority.Medium:
            return "bg-yellow-100";
        case Priority.Low:
            return "bg-green-100";
        case Priority.None:
            return "bg-white";
        default:
            return "bg-white"
    }
}