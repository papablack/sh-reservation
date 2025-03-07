import { IsString, IsEnum, IsOptional, IsDate, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TaskStatus } from '../interfaces/ITask';
import { plainToClass } from 'class-transformer';
import { IReservationData } from 'backend/src/services/XLSService';
import { BookingStatus } from '../interfaces/IBooking';

export class BookingDTO {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!value || typeof value !== 'string' || value.trim() === '') {
            throw new Error('Guest name cannot be empty');
        }
        return value.trim();
    })
    guest_name: string;

    @IsNumber()
    @Transform(({ value }) => {
        const num = Number(value);
        if (isNaN(num)) {
            throw new Error('Reservation ID must be a valid number');
        }
        return num;
    })
    @IsNotEmpty()
    reservation_id: number;

    @IsEnum(TaskStatus)
    @IsNotEmpty()
    status: BookingStatus;

    @IsDate()
    @IsNotEmpty()
    @Transform(({ value }) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid check-in date format');
        }
        return date;
    })
    @Type(() => Date)
    check_in_date: Date;

    @IsDate()
    @IsNotEmpty()
    @Transform(({ value }) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid check-out date format');
        }
        return date;
    })
    @Type(() => Date)
    check_out_date: Date;
}

export function parseBooking(reservationData: Record<string, any>): BookingDTO
{
    return plainToClass(BookingDTO, reservationData);
}