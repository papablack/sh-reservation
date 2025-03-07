import { IXLSXProcessError } from "../../services/XLSService";
import { IUser } from "../interfaces/IUser";

export enum TaskStatus {
    AWAITING = 'awaiting',
    CANCELLED = 'cancelled',
    DONE = 'done'
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