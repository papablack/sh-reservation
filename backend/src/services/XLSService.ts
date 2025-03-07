import { Injectable, Logger } from '@nestjs/common';
import { createReadStream } from 'fs';
//@ts-ignore
import xlsxParseStream  from 'xlsx-parse-stream';
import { BookingDTO, parseBooking } from '../models/dto/booking.dto';

export interface IXLSXProcessError {
    row: number,
    error: string
}

export interface IReservationData {
    reservation_id: number;
    guest_name: string;
    status: string;
    check_in_date: Date;
    check_out_date: Date;
}

export interface XLSFileResults{
    results: BookingDTO[], 
    errors: IXLSXProcessError[]
}

@Injectable()
export class XLSService {
    private logger = new Logger(this.constructor.name);

    async processXLSXFile(filePath: string): Promise<XLSFileResults> {
        const errors: IXLSXProcessError[] = [];
        let rowNumber = 0;        

        try {
            return new Promise((resolve, reject) => {
                const results: BookingDTO[] = [];
                const parser = xlsxParseStream({
                    mapHeaders: (header: any) => String(header).toLowerCase().trim(),
                    mapValues: (value: any) => value === null ? undefined : value
                });
    
                // Używamy bezpośrednio bufora z pliku
                const fileStream = createReadStream(filePath);
                
                parser.on('header', (headers: string[]) => {
                    this.logger.debug('Processing headers:', headers);                                        
                    const requiredColumns = ['reservation_id', 'guest_name', 'status', 'check_in_date', 'check_out_date'];
                    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
                    
                    if (missingColumns.length > 0) {
                        reject(new Error(`Missing required columns: ${missingColumns.join(', ')}`));
                    }
                });
    
                parser.on('data', (row: Record<string, any>) => {
                    rowNumber++;
                    try {                                                                   
                        results.push(parseBooking(row));
                    } catch (error: any) {
                        this.logger.warn(`Error processing row ${rowNumber}: ${error.message}`);
                        errors.push({
                            row: rowNumber,
                            error: error.message
                        });
                    }
                });
    
                parser.on('error', (error: Error) => {
                    this.logger.error('Error processing XLSX:', error);
                    reject(error);
                });
    
                parser.on('end', () => {
                    this.logger.debug(`Processed ${results.length} / ${rowNumber} rows with ${errors.length} errors`);                    
                    resolve({results, errors});
                });
    
                fileStream.pipe(parser);
            });

        } catch (error) {
            this.logger.error('XLSX stream read error');
        }
    }
}
