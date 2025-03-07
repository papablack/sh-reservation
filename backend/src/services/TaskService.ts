import { Injectable, Logger } from '@nestjs/common';
import Task from '../models/Task';
import { IReservationData, XLSService } from './XLSService';
import { BookingDTO, parseBooking } from '../models/dto/booking.dto';
import User from '../models/User';
import Booking from '../models/Booking';
import { FileStorageService } from './FileStorageService';

@Injectable()
export class TaskService {
    private logger = new Logger(this.constructor.name);

    constructor(private xlsService: XLSService, private fileService: FileStorageService){

    }

    async makeTask(fileName: string, originalFileName: string, user: User): Promise<Task>
    {
        const task = new Task({
            assignee: user,
            fileName,
            originalFileName
        });

        await task.save();

        return task;
    }

    async runTask(taskId: string): Promise<void>
    {
        const task = await Task.find(taskId);
        try {
            const xlsData = await this.xlsService.processXLSXFile(this.fileService.getFilePath(task.fileName));

            for (const resData of xlsData.results)
            {                            
                await this.processReservations(resData, task);
            }

            task.errors = xlsData.errors;
            task.status = Task.TaskStatus.DONE;

            await task.save();
        }catch(e: Error | any){
            task.errors = [{
                row: -1,
                error: e.message                
            }];
            await task.save();
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
        }else{
            booking = await Booking.findOneBy({ conditions: { reservation_id: resData.reservation_id } });

            if(booking){        
                booking._fill(resData);
                await booking.save();
            }
        }        

        return booking;
    }
}
