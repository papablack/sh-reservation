import { Module } from '@nestjs/common';

import { HomeController } from '../controllers/home.controller';
import { UserController } from '../controllers/user.controller';

import { WSGateway } from '../gateways/WSGateway';

import { UtilsService, RWSFillService } from '@rws-framework/server';
import { AuthService } from '../services/AuthService';
import { ConfigService } from '@nestjs/config';
import { WebsocketManagerService } from '@rws-framework/nest-interconnectors/src/backend/services/WebsocketManagerService';

import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { NotFoundExceptionFilter } from '../filters/not-found.filter';
import { NestModuleData } from '@rws-framework/server/exec/src/application/cli.module';
import { AdminStartCommand } from '../commands/adminadd.command';
import { TaskController } from '../controllers/task.controller';
import { ApiKeyCommand } from '../commands/apikey.command';
import { XLSService } from '../services/XLSService';
import { QueueService } from '../services/QueueService';
import { TaskService } from '../services/TaskService';
import { BullModule } from '@nestjs/bullmq';
import { TaskProcessor } from '../processors/task.processor';
import { FileStorageService } from '../services/FileStorageService';


@Module({})
export class TheAppModule {
  static forRoot(parentModule: NestModuleData){
    const imports = [
      BullModule.forRoot({
        connection: {
          host: 'localhost',
          port: parseInt(process.env.REDIS_PORT),
        },
      }),
      BullModule.registerQueue({
        name: 'tasks'
      })
    ];

    const processedImports = parentModule ? [parentModule, ...imports] : imports;

    return {
      module: TheAppModule,
      imports: processedImports,
      controllers:[
        HomeController,   
        UserController,
        TaskController
      ],
      providers: [
        AuthService, 
        UtilsService,
        RWSFillService,
        WebsocketManagerService,
        WSGateway,
        XLSService,
        QueueService,
        TaskService,
        TaskProcessor,
        FileStorageService
      ],
      exports: [
        WebsocketManagerService
      ]
    }
  }
}
