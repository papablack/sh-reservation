import { Socket } from 'socket.io';
import {  RWSGateway } from '@rws-framework/server';
import { Injectable } from '@rws-framework/server/nest';
import Task from '../models/Task';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';



@Injectable()
export class WSGateway extends RWSGateway {
  private logger = new Logger(this.constructor.name);
  @OnEvent('task.added')
  handleTaskAdded(task: Task): void {
    this.sendTaskInfo(task);
  }

  @OnEvent('task.processed')
  handleTaskProcessed(task: Task): void {
    this.sendTaskInfo(task);
  }

  sendTaskInfo(task: Task): void
  {    
    const eventName = `task-status`;

    const sanitizedTask = {
      id: task.id,
      status: task.status,
      fileName: task.fileName,
      originalFileName: task.originalFileName,
      errors: task.errors,
      created_at: task.created_at?.toISOString(),
      updated_at: task.updated_at?.toISOString(),
    };

    this.server.emit(eventName, JSON.stringify({ method: eventName, data: sanitizedTask }));
    this.logger.debug(`Task sent on event "${eventName}"`);

  }

  handleConnection(socket: Socket): void {
  }

  handleDisconnect(socket: Socket): void {   
  }
}
