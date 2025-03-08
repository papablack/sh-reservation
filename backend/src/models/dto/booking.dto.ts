import { IsString, IsEnum, IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { BookingStatus } from '../interfaces/IBooking';

export class BookingDTO {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim() ?? '')
    guest_name: string;

    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    reservation_id: number;

    @IsEnum(BookingStatus, {
        message: `status must be one one of given values: ${Object.values(BookingStatus).map(it => `"${it}"`).join(', ')}`
    })
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

export async function parseBooking(reservationData: Record<string, any>): Promise<{ booking: BookingDTO | null, errors: string[] }> {
    try {
        const booking = plainToClass(BookingDTO, reservationData);
        const validationErrors = await validate(booking);

        if (validationErrors.length > 0) {
            const errors = validationErrors.map(error => {
                const constraints = error.constraints || {};
                return Object.values(constraints);
            }).flat();

            return {
                booking: null,
                errors
            };
        }

        if (booking.check_in_date && booking.check_out_date) {
            if (booking.check_in_date >= booking.check_out_date) {
                return {
                    booking: null,
                    errors: ['check_in_date must be before check-out date']
                };
            }
        }

        return {
            booking,
            errors: []
        };
    } catch (error) {
        return {
            booking: null,
            errors: [error instanceof Error ? error.message : 'Unknown validation error']
        };
    }
}