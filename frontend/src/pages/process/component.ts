import { RWSViewComponent, RWSView, observable, ApiService, RWSInject } from '@rws-framework/client';
import { UsersForm } from '../../components/user-form/component';
import moment from 'moment';
import { ITask, ITaskProcessApiResponse } from '../../backendImport';
import { WSService, WSServiceInstance } from '@rws-framework/nest-interconnectors';

@RWSView('page-reservation')
class ReservationProcessPage extends RWSViewComponent {  
    @observable listening = false;
    @observable task: ITask;

    constructor(@RWSInject(WSService) private wsService: WSServiceInstance){
        super();
    }

    connectedCallback(): void {
        super.connectedCallback()
        this.wsService.listenForMessage((wsData) => {
            this.task = wsData.data;
            this.listening = true;

            console.log({list: this.listening, task: this.task})
        } , `task-status`);
    }

    async sendFile()
    {
        const fileInput = this.$('#xlsxFile') as HTMLInputElement;

        if(fileInput.files.length === 0){
            alert('No file selected.')
            return;
        }
        
        const uploaderResponse = await this.apiService.back.uploadFile('task.process', fileInput.files[0], (progress:number) =>{
            console.log(`Uploading ${progress}%`)
        });

        const response: ITaskProcessApiResponse = JSON.parse(uploaderResponse.xhr.response);
    }
}

ReservationProcessPage.defineComponent();

export { ReservationProcessPage };