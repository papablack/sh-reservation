import { TrackType, Relation, RWSModel, RWSCollection } from '@rws-framework/db';
import { RWSResource } from '@rws-framework/server';
import { ITask, TaskPriority, TaskStatus } from './interfaces/ITask';
import User from './User';
import 'reflect-metadata';

@RWSResource('sh.task')
@RWSCollection('task', {
    relations: {
        assignee: true
    }
})
export default class Task extends RWSModel<Task> implements ITask {
    @TrackType(String)
    title: string;

    @TrackType(String)
    reservationId: string;

    @TrackType(String)
    description: string;

    @TrackType(String)
    priority: TaskPriority;

    @TrackType(String)
    status: TaskStatus;

    @Relation(() => User, { required: true, cascade: { onDelete: 'Cascade', onUpdate: 'Cascade' } })
    assignee: User;

    @TrackType(Date)
    due_date?: Date;

    @TrackType(Date, { required: true })
    created_at: Date;
  
    @TrackType(Date)
    updated_at: Date;    

    constructor(data?: ITask) {   
        super(data);    

        if(!this.created_at){
            this.created_at = new Date();
        }    

        this.updated_at = new Date();

        if (!this.status) {
            this.status = TaskStatus.TODO;
        }

        if (!this.priority) {
            this.priority = TaskPriority.MEDIUM;
        }
    }    
}
