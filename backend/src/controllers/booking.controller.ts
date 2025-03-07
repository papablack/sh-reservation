import { RWSController } from '@rws-framework/server/nest';
import Booking from '../models/Booking';
import { RWSAutoApiController } from '@rws-framework/server';

@RWSController('booking', () => Booking)
export class BookingController extends RWSAutoApiController {}
