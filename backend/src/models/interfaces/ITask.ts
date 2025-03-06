import { IUser } from "../interfaces/IUser";

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export enum TaskStatus {
    AWAITING = 'awaiting',
    CANCELLED = 'cancelled',
    DONE = 'done'
}

export interface ITask {
    id?: string;
    title: string;
    description: string;
    reservationId: string;
    priority: TaskPriority;
    status: TaskStatus;
    assignee: IUser;
    due_date?: Date;
    created_at: Date;
    updated_at: Date;
}