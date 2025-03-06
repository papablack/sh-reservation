import { Body, Logger, UseInterceptors } from '@nestjs/common';
import { Param, UploadedFile } from '@nestjs/common';
import { RWSRoute, RWSController } from '@rws-framework/server/nest';
import { Auth, AuthUser } from '../guards/auth.guard';
import Task from '../models/Task';
import { RWSAutoApiController } from '@rws-framework/server';
import { FileInterceptor } from '@nestjs/platform-express';
import User from '../models/User';
import { XLSService } from '../services/XLSService';
import { ITaskProcessApiResponse } from './response-types/ITaskApiResponse';
import { QueueService } from '../services/QueueService';
import { TaskService } from '../services/TaskService';
import { FileStorageService } from '../services/FileStorageService';



@RWSController('task', () => Task)
export class TaskController extends RWSAutoApiController {    
    private logger = new Logger(this.constructor.name);

    constructor(
        private xlsService: XLSService, 
        private queueService: QueueService, 
        private taskService: TaskService,
        private fileStorageService: FileStorageService
    ){
        super();
    }

    @RWSRoute('task.process')
    @UseInterceptors(FileInterceptor('file'))
    @Auth()
    async processAction(@UploadedFile() sentFile: Express.Multer.File, @AuthUser() loggedUser: User): Promise<ITaskProcessApiResponse>
    {
        if (!sentFile) {
            throw new Error('No file sent!');
        }

        try {
            const { fileName, originalName } = await this.fileStorageService.saveFile(sentFile);
            const task = await this.taskService.makeTask(fileName, originalName, loggedUser);
            await this.queueService.addToQueue(task.id);

            const taskId = task.id;
            return {
                success: true,
                data: {
                    taskId
                }
            }
        }catch(e : Error | any){
            this.logger.error(`Error in file processing: ${e.message}`)
            return {
                success: true,
                error: `Error in file processing: ${e.message}`
            }
        }        
    }

    @RWSRoute('task.status')
    async statusAction(@Param('taskId') taskId: string)
    {
        return {
            success: true
        }
    }
}
