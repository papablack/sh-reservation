import { IUser } from "./IUser";

export enum BookingStatus {
    AWAITING = 'awaiting',
    CANCELLED = 'cancelled',
    DONE = 'done'
}

export interface IBooking {
    id?: string;
    reservationId: string;
    guestName: string;
    status: BookingStatus;
    assignee: IUser;
    check_in_date: Date;
    check_out_date: Date;
    created_at: Date;
    updated_at: Date;
}