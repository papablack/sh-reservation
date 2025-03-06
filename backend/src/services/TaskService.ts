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
        
        const xlsData = await this.xlsService.processXLSXFile(this.fileService.getFilePath(task.fileName));
        for (const resData of xlsData.results.map(parseBooking))
        {            
            await this.processReservations(resData, task);
        }

        task.status = Task.TaskStatus.DONE;
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
                booking.reservation_id = resData.reservation_id;
                booking.guest_name = resData.guest_name;
                booking.status = resData.status;
                booking.check_in_date = resData.check_in_date;        
                booking.check_out_date = resData.check_out_date;        

                await booking.save();
            }
        }        

        return booking;
    }
}
