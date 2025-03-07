import { RWSViewComponent, RWSView, observable, ApiService, RWSInject } from '@rws-framework/client';
import { UsersForm } from '../../components/user-form/component';
import moment from 'moment';
import { ITask, ITaskProcessApiResponse } from '../../backendImport';
import { WSService, WSServiceInstance } from '@rws-framework/nest-interconnectors';

@RWSView('page-reservation-list')
class ReservationList extends RWSViewComponent {  
    @observable fields: string[] = ['id', 'reservation_id', 'status', 'check_in_date', 'check_out_date']
}

ReservationList.defineComponent();

export { ReservationList };