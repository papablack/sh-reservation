import { TrackType, RWSModel, Relation, RWSCollection } from '@rws-framework/db';
import { RWSResource } from '@rws-framework/server';

import 'reflect-metadata';
import {BookingStatus, IBooking} from './interfaces/IBooking';
import User from './User';

@RWSResource('sh.booking')
@RWSCollection('booking')
class Booking extends RWSModel<Booking> implements IBooking {
    static _collection = 'bookings';

    static _RELATIONS = {
        assignee: true
    };

    @TrackType(String)
    reservationId: string;

    @TrackType(String)
    guestName: string;

    @TrackType(String)
    status: BookingStatus;

    @Relation(() => User, { required: true, cascade: { onDelete: 'Cascade', onUpdate: 'Cascade' } })
    assignee: User;

    @TrackType(Date, { required: true })
    check_in_date: Date;

    @TrackType(Date, { required: true })
    check_out_date: Date;

    @TrackType(Date, { required: true })
    created_at: Date;
  
    @TrackType(Date)
    updated_at: Date;

    constructor(data?: IBooking) {   
        super(data);    

        if(!this.created_at){
            this.created_at = new Date();
        }    

        this.updated_at = new Date();

        if(!this.status) {
            this.status = BookingStatus.PENDING;
        }
    }    

    // Metody pomocnicze możemy zostawić
    isActive(): boolean {
        const now = new Date();
        return now >= this.check_in_date && now <= this.check_out_date;
    }

    getDurationInDays(): number {
        return Math.ceil(
            (this.check_out_date.getTime() - this.check_in_date.getTime()) / (1000 * 3600 * 24)
        );
    }

    validate(): boolean {
        if (this.check_in_date >= this.check_out_date) {
            throw new Error('Check-in date must be before check-out date');
        }

        if (this.check_in_date < new Date()) {
            throw new Error('Cannot create booking in the past');
        }

        return true;
    }
}

export default Booking;
