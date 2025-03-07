import { RWSViewComponent, RWSView, observable, attr } from '@rws-framework/client';
import { ITask } from '../../../../backend/src/pkgExport';
import moment from 'moment';

@RWSView('show-task')
class ShowTask extends RWSViewComponent {      
    @observable task: ITask;

    connectedCallback(): void 
    {
        super.connectedCallback();  
    }    

    formatDate(date: string): string
    {
        return moment(date).format('D-MM-Y H:m:ss');
    }
}

ShowTask.defineComponent();

export { ShowTask };