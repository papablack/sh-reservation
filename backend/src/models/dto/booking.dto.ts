import { IsString, IsEnum, IsOptional, IsDate, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../interfaces/ITask';
import { plainToClass } from 'class-transformer';
import { IReservationData } from 'backend/src/services/XLSService';
import { BookingStatus } from '../interfaces/IBooking';

export class BookingDTO {
    @IsString()
    @IsNotEmpty()
    guest_name: string;

    @IsNumber()
    @IsNotEmpty()
    reservation_id: number;

    @IsEnum(TaskStatus)
    @IsNotEmpty()
    status: BookingStatus;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    check_in_date: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    check_out_date: Date;
}

export function parseBooking(reservationData: IReservationData): BookingDTO
{
    return plainToClass(BookingDTO, reservationData);
}