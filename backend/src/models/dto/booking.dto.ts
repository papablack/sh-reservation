import { IsString, IsEnum, IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { plainToClass } from 'class-transformer';
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

    @IsEnum(BookingStatus)
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!value) {
            throw new Error('Status is required');
        }
        if (!Object.values(BookingStatus).includes(value)) {
            throw new Error(`Invalid status. Must be one of: ${Object.values(BookingStatus).join(', ')}`);
        }
        return value;
    })
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