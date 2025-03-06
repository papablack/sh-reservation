import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class FileStorageService {
    private logger = new Logger(this.constructor.name);
    private uploadDir: string;

    constructor() {
        this.uploadDir = path.join(process.cwd(), 'files');
        this.ensureDirectoryExists(this.uploadDir);
    }

    private ensureDirectoryExists(directory: string): void {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    async saveFile(file: Express.Multer.File): Promise<{ fileName: string, originalName: string }> {
        try {
            // Generate unique filename using timestamp and hash
            const timestamp = Date.now();
            const hash = crypto.createHash('md5')
                .update(`${timestamp}-${file.originalname}`)
                .digest('hex');
            const fileExt = path.extname(file.originalname);
            const fileName = `${hash}${fileExt}`;
            const filePath = path.join(this.uploadDir, fileName);

            // Write file to disk
            await fs.promises.writeFile(filePath, file.buffer);

            this.logger.debug(`File saved successfully: ${fileName}`);

            return {
                fileName,
                originalName: file.originalname
            };
        } catch (error) {
            this.logger.error('Error saving file:', error);
            throw new Error('Failed to save file');
        }
    }

    async deleteFile(fileName: string): Promise<void> {
        try {
            const filePath = path.join(this.uploadDir, fileName);
            if (await this.fileExists(filePath)) {
                await fs.promises.unlink(filePath);
                this.logger.debug(`File deleted successfully: ${fileName}`);
            }
        } catch (error) {
            this.logger.error(`Error deleting file ${fileName}:`, error);
            throw new Error('Failed to delete file');
        }
    }

    async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.promises.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    getFilePath(fileName: string): string {
        return path.join(this.uploadDir, fileName);
    }
}