import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../services/TaskService';
import { XLSService, IXLSXProcessError, XLSFileResults } from '../services/XLSService';
import { FileStorageService } from '../services/FileStorageService';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Task from '../models/Task';
import Booking from '../models/Booking';
import User from '../models/User';
import { BookingDTO, parseBooking } from '../models/dto/booking.dto';
import { BookingStatus as BookStatusEnum } from '../models/interfaces/IBooking';
import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals';


jest.mock('../models/Task', () => {
  return {
    __esModule: true,
    default: class MockTask {
      static TaskStatus: Record<string, string> = {
        PENDING: 'pending',
        IN_PROGRESS: 'in_progress',
        COMPLETED: 'completed',
        FAILED: 'failed'
      };

      assignee: any;
      fileName: string;
      originalFileName: string;
      status: string;
      errors: IXLSXProcessError[];

      constructor(data: any) {
        Object.assign(this, data);
        this.errors = [];
        this.status = MockTask.TaskStatus.PENDING;
      }

      save = jest.fn().mockImplementation(async () => Promise.resolve());

      static find = jest.fn().mockImplementation(function(...args: any[]) {
        const id = args[0];
        const mockTask = new MockTask({
          id,
          fileName: 'test.xlsx',
          originalFileName: 'original_test.xlsx',
          assignee: { id: 'user-id' }
        });
        
        mockTask.save = jest.fn().mockImplementation(async function(this: any) {
          return Promise.resolve(this);
        });
        
        return Promise.resolve(mockTask);
      });
    }
  };
});

jest.mock('../models/Booking', () => {
  return {
    __esModule: true,
    default: class MockBooking {
      // sorry for this jest doesnt like importing enums apparently :/
      static BookingStatus: Record<string, string> = {
        AWAITING: 'oczekująca',
        CANCELLED: 'anulowana',
        DONE: 'zrealizowana'
      };

      reservation_id: number;
      guest_name: string;
      status: string;
      assignee: any;
      fromTask: any;
      check_in_date: Date;
      check_out_date: Date;
      created_at: Date;
      updated_at: Date;

      constructor(data: any) {
        Object.assign(this, data);
        this.created_at = new Date();
        this.updated_at = new Date();
      }

      save = jest.fn().mockImplementation(async () => Promise.resolve());
      _fill = jest.fn().mockImplementation((data: any) => {
        return Object.assign({}, data);
      });

      static findOneBy = jest.fn().mockImplementation(function(params: any) {
        if (params.conditions && params.conditions.reservation_id === 123) {
          return Promise.resolve(new MockBooking({
            reservation_id: 123,
            guest_name: 'Existing Guest',
            status: MockBooking.BookingStatus.CANCELLED
          }));
        }
        return Promise.resolve(null);
      });
    }
  };
});

describe('TaskService', () => {
  let service: TaskService;
  let xlsService: XLSService;
  let fileService: FileStorageService;

  beforeEach(async () => {
    const mockXlsService = {
      processXLSXFile: jest.fn()
    };

    const mockFileService = {
      getFilePath: jest.fn()
    };

    const mockEventEmitter = {
      emit: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: XLSService, useValue: mockXlsService },
        { provide: FileStorageService, useValue: mockFileService },
        { provide: EventEmitter2, useValue: mockEventEmitter }
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    xlsService = module.get<XLSService>(XLSService);
    fileService = module.get<FileStorageService>(FileStorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('makeTask', () => {
    it('should create a new task and save it', async () => {
      const fileName = 'test.xlsx';
      const originalFileName = 'original_test.xlsx';
      const user = { id: 'user-id' } as User;

      const result = await service.makeTask(fileName, originalFileName, user);

      expect(result).toBeDefined();
      expect(result.fileName).toBe(fileName);
      expect(result.originalFileName).toBe(originalFileName);
      expect(result.assignee).toBe(user);
      expect(result.save).toHaveBeenCalled();
    });
  });

  describe('runTask', () => {
    it('should process an XLSX file and create bookings', async () => {
      const taskId = '1337hireme';
      const filePath = '/path/to/file.xlsx';
      const bookingData = {
        reservation_id: 456,
        guest_name: 'New Guest',
        status: BookStatusEnum.AWAITING,
        check_in_date: new Date(),
        check_out_date: new Date(Date.now() + 86400000) // tomorrow
      };
      
      const { booking } = await parseBooking(bookingData);
      const xlsData: XLSFileResults = {
        results: [booking],
        errors: []
      };

      jest.spyOn(fileService, 'getFilePath').mockReturnValue(filePath);
      jest.spyOn(xlsService, 'processXLSXFile').mockResolvedValue(xlsData);

      await service.runTask(taskId);

      expect(Task.find).toHaveBeenCalledWith(taskId);
      expect(fileService.getFilePath).toHaveBeenCalledWith('test.xlsx');
      expect(xlsService.processXLSXFile).toHaveBeenCalledWith(filePath);
      
      expect(Task.find).toHaveBeenCalledWith(taskId);
      expect(fileService.getFilePath).toHaveBeenCalledWith('test.xlsx');
      expect(xlsService.processXLSXFile).toHaveBeenCalledWith(filePath);
    });

    it('should handle errors during processing', async () => {
      const taskId = '1337hireme';
      const errorMessage = 'Processing error';
      
      jest.spyOn(fileService, 'getFilePath').mockReturnValue('/path/to/file.xlsx');
      jest.spyOn(xlsService, 'processXLSXFile').mockRejectedValue(new Error(errorMessage));


      await service.runTask(taskId);

      expect(Task.find).toHaveBeenCalledWith(taskId);
      expect(fileService.getFilePath).toHaveBeenCalledWith('test.xlsx');
      expect(xlsService.processXLSXFile).toHaveBeenCalledWith('/path/to/file.xlsx');
    });
  });

  describe('processReservations', () => {
    it('should create a new booking when status is AWAITING', async () => {
      const task = await Task.find('1337hireme');
      const reservationData = {
        reservation_id: 456,
        guest_name: 'New Guest',
        status: BookStatusEnum.AWAITING,
        check_in_date: new Date(),
        check_out_date: new Date(Date.now() + 86400000) // tomorrow
      };
      
      const { booking } = await parseBooking(reservationData);
      const result = await service.processReservations(booking, task);

      expect(result).toBeDefined();
      expect(result?.reservation_id).toBe(reservationData.reservation_id);
      expect(result?.guest_name).toBe(reservationData.guest_name);
      expect(result?.status).toBe(reservationData.status);
      expect(result?.assignee).toBe(task.assignee);
      expect(result?.fromTask).toBe(task);
      expect(result?.save).toHaveBeenCalled();
      expect(Booking.findOneBy).not.toHaveBeenCalled();
    });

    it('should update an existing booking when it exists', async () => {
      const task = await Task.find('1337hireme');
      const reservationData = {
        reservation_id: 123, // This ID exists in our mock
        guest_name: 'Updated Guest Name',
        status: BookStatusEnum.CANCELLED,
        check_in_date: new Date(),
        check_out_date: new Date(Date.now() + 86400000) // tomorrow
      };
      
      const { booking } = await parseBooking(reservationData);
      const result = await service.processReservations(booking, task);

      expect(result).toBeDefined();
      expect(Booking.findOneBy).toHaveBeenCalledWith({ 
        conditions: { reservation_id: reservationData.reservation_id } 
      });
      expect(result?._fill).toHaveBeenCalledWith(booking);
      expect(result?.save).toHaveBeenCalled();
    });

    it('should return null when booking does not exist and status is not AWAITING', async () => {
      // Arrange
      const task = await Task.find('1337hireme');
      const reservationData = {
        reservation_id: 789,
        guest_name: 'Non-existent Guest',
        status: BookStatusEnum.CANCELLED,
        check_in_date: new Date(),
        check_out_date: new Date(Date.now() + 86400000)
      };
      
      const { booking } = await parseBooking(reservationData);
      jest.spyOn(Booking, 'findOneBy').mockResolvedValueOnce(null);

      const result = await service.processReservations(booking, task);

      expect(result).toBeNull();
      expect(Booking.findOneBy).toHaveBeenCalledWith({ 
        conditions: { reservation_id: reservationData.reservation_id } 
      });
    });
  });
});
