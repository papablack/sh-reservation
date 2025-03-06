import { Body } from '@nestjs/common';
import {IUser} from '../models/interfaces/IUser';
import { Param, UploadedFile } from '@nestjs/common';
import { RWSRoute, RWSController } from '@rws-framework/server/nest';
import { Auth, AuthUser } from '../guards/auth.guard';
import Task from '../models/Task';
import { RWSAutoApiController } from '@rws-framework/server';

@RWSController('task', () => Task)
export class TaskController extends RWSAutoApiController {    
    @RWSRoute('task.process')
    processAction(@UploadedFile('file') sentFile: File)
    {
        return {
            success: true
        }
    }

    @RWSRoute('task.status')
    statusAction(@Param('taskId') taskId: string)
    {
        return {
            success: true
        }
    }
}
