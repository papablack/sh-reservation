import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import Task from '../models/Task';

@Injectable()
export class QueueService {
    private logger = new Logger(this.constructor.name);

    constructor(
        @InjectQueue('tasks') private tasksQueue: Queue
    ) {}

    async addToQueue(taskId: string): Promise<void> {
        try {
            await this.tasksQueue.add('process-reservations', {
                taskId: taskId
            }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                },
                removeOnComplete: true
            });

            this.logger.debug(`Task ${taskId} added to queue`);
        } catch (error) {
            this.logger.error(`Failed to add task ${taskId} to queue:`, error);
            throw error;
        }
    }
}
