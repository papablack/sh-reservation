import { TrackType, Relation, RWSModel, RWSCollection, InverseRelation } from '@rws-framework/db';
import { RWSResource } from '@rws-framework/server';
import { ITask, TaskStatus } from './interfaces/ITask';
import User from './User';
import 'reflect-metadata';
import Booking from './Booking';
import { IXLSXProcessError } from '../services/XLSService';

@RWSCollection('task', { relations: { assignee: true } })
export default class Task extends RWSModel<Task> implements ITask {
    static TaskStatus = TaskStatus;

    @TrackType(String)
    status: TaskStatus = TaskStatus.AWAITING;

    @InverseRelation(() => Booking, () => Task)
    bookings: Booking[] = []

    @Relation(() => User, { required: true, cascade: { onDelete: 'Cascade', onUpdate: 'Cascade' } })
    assignee: User;

    @TrackType(Date, { required: true })
    created_at: Date;
  
    @TrackType(Date)
    updated_at: Date;    

    @TrackType(String)
    fileName: string;

    @TrackType(String)
    originalFileName: string;

    @TrackType(Array)
    errors: IXLSXProcessError[] = [];

    constructor(data?: ITask) {   
        super(data);    

        if(!this.created_at){
            this.created_at = new Date();
        }    

        this.updated_at = new Date();
    }    
}
