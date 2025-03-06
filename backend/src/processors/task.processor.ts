import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { TaskService } from '../services/TaskService';

@Processor('tasks')
export class TaskProcessor extends WorkerHost {
    private readonly logger = new Logger(TaskProcessor.name);

    constructor(
        private readonly taskService: TaskService
    ) {
        super();
    }

    async process(job: Job<{ taskId: string }, any, string>): Promise<void> {
        this.logger.debug(`Processing job ${job.id} for task ${job.data.taskId}`);

        try {
            const taskId = job.data.taskId;
            this.taskService.runTask(taskId);
            
            this.logger.debug(`Successfully processed job ${job.id} for task ${job.data.taskId}`);
        } catch (error) {
            this.logger.error(`Failed to process job ${job.id} for task ${job.data.taskId}:`, error);
            throw error;
        }
    }
}