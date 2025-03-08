import { IXLSXProcessError } from "../../services/XLSService";
import { IUser } from "../interfaces/IUser";

export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export interface ITask {
    id?: string;
    fileName: string;
    originalFileName: string;
    status?: TaskStatus;
    assignee: IUser;
    errors?: IXLSXProcessError[]
    created_at?: Date;
    updated_at?: Date;
}