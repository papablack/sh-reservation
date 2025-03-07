

import { renderRouteComponent } from '@rws-framework/browser-router';
import { UsersPage } from '../pages/users/component';
import { ReservationProcessPage } from '../pages/process/component';
import { ReservationList } from '../pages/reservations/component';

export default {
    '/': renderRouteComponent('Reservations processing page', ReservationProcessPage),
    '/reservations': renderRouteComponent('Reservations list', ReservationList),
    '/users': renderRouteComponent('Users page', UsersPage)
};