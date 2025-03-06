import { IReservationData } from "../../services/XLSService";
import { BookingDTO } from "../dto/booking.dto";
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
    created_at?: Date;
    updated_at?: Date;
}