import { ITask } from "./ITask";
import { IUser } from "./IUser";

export enum BookingStatus {
    AWAITING = 'oczekująca',
    CANCELLED = 'anulowana',
    DONE = 'zrealizowana'
}

export interface IBooking {
    id?: string;
    reservation_id: number;
    guest_name: string;
    status: BookingStatus;
    assignee: IUser;
    fromTask: ITask;
    check_in_date: Date;
    check_out_date: Date;
    created_at: Date;
    updated_at: Date;
}