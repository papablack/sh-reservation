import { Test, TestingModule } from '@nestjs/testing';
import { XLSService } from '../services/XLSService';
import * as path from 'path';
import { describe, expect, it, beforeEach } from '@jest/globals';

describe('XLSService', () => {
  let service: XLSService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [XLSService],
    }).compile();

    service = await moduleRef.resolve(XLSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processXLSXFile', () => {
    it('should successfully process a valid XLSX file', async () => {
      // Arrange
      const filePath = path.join(__dirname, '../../example.xlsx');

      // Act
      const result = await service.processXLSXFile(filePath);

      // Assert
      expect(result).toBeDefined();
      expect(result.results).toBeInstanceOf(Array);
      expect(result.errors).toBeInstanceOf(Array);
      expect(result.errors.length).toBe(0);
      
      // Verify the structure of processed bookings
      if (result.results.length > 0) {
        const firstBooking = result.results[0];
        expect(firstBooking).toHaveProperty('reservation_id');
        expect(firstBooking).toHaveProperty('guest_name');
        expect(firstBooking).toHaveProperty('status');
        expect(firstBooking).toHaveProperty('check_in_date');
        expect(firstBooking).toHaveProperty('check_out_date');
      }
    });

    it('should handle errors in XLSX file processing', async () => {
      // Arrange
      const filePath = path.join(__dirname, '../../error_example.xlsx');

      // Act
      const result = await service.processXLSXFile(filePath);

      // Assert
      expect(result).toBeDefined();
      expect(result.results).toBeInstanceOf(Array);
      expect(result.errors).toBeInstanceOf(Array);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle malformed data in rows', async () => {
      // Arrange
      const filePath = path.join(__dirname, '../../error_example.xlsx');

      // Act
      const result = await service.processXLSXFile(filePath);

      // Assert
      expect(result.errors).toBeInstanceOf(Array);
      expect(result.errors.some(error => error.error.includes('Invalid'))).toBeTruthy();
    });
  });
});