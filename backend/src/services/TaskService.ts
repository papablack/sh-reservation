import { Injectable, Logger } from '@nestjs/common';
import Task from '../models/Task';
import { IReservationData, XLSService } from './XLSService';
import { BookingDTO, parseBooking } from '../models/dto/booking.dto';
import User from '../models/User';
import Booking from '../models/Booking';
import { FileStorageService } from './FileStorageService';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskStatus } from '../models/interfaces/ITask';

@Injectable()
export class TaskService {
    private logger = new Logger(this.constructor.name);
    constructor(
        private xlsService: XLSService, 
        private fileService: FileStorageService,
        private eventEmitter: EventEmitter2
    ){}

    async makeTask(fileName: string, originalFileName: string, user: User): Promise<Task>
    {
        const task = new Task({
            assignee: user,
            fileName,
            originalFileName
        });

        await task.save();
        
        // Emit task added event
        this.eventEmitter.emit('task.added', task);

        return task;
    }

    async runTask(taskId: string): Promise<void>
    {
        const task = await Task.find(taskId);

        task.status = TaskStatus.IN_PROGRESS;
        await task.save();

        try {
            const xlsData = await this.xlsService.processXLSXFile(this.fileService.getFilePath(task.fileName));

            for (const resData of xlsData.results)
            {                            
                await this.processReservations(resData, task);
            }

            task.errors = xlsData.errors;
            
            if(task.errros.length){
                task.status = TaskStatus.FAILED;
            }else{
                task.status = TaskStatus.COMPLETED;
            }

            await task.save();
            
            // Emit task processed event
            this.eventEmitter.emit('task.processed', task);
        }catch(e: Error | any){
            task.errors = [{
                row: -1,
                error: e.message                
            }];
            await task.save();
            
            // Emit task processed event even on error
            this.eventEmitter.emit('task.processed', task);
        }
    }

    async processReservations(resData: BookingDTO, task: Task): Promise<Booking | null>
    {
        let booking: Booking | null = null;

        if(resData.status === Booking.BookingStatus.AWAITING){
            booking = new Booking(resData);
            booking.assignee = task.assignee;
            booking.fromTask = task;
            
            await booking.save();
            this.logger.debug(`Created booking entry with reservation_id: "${booking.reservation_id}"`);
        }else{
            booking = await Booking.findOneBy({ conditions: { reservation_id: resData.reservation_id } });

            if(booking){        
                booking._fill(resData);
                await booking.save();
                this.logger.debug(`Updated booking entry with reservation_id: "${booking.reservation_id}"`);
            }
        }        

        return booking;
    }
}
