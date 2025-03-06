

import 'reflect-metadata';

import {v4 as uuid} from 'uuid';

import { Injectable, Logger } from '@nestjs/common';
import { DBService, ProcessService } from '@rws-framework/server';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/AuthService';
import { ConsoleService, UtilsService } from '@rws-framework/server';
import { RWSBaseCommand, RWSCommand } from '@rws-framework/server/src/commands/_command';
import { ParsedOptions } from '@rws-framework/server/exec/src/application/cli.module';

import User from '../models/User';
import ApiKey from '../models/ApiKey';


@Injectable()
@RWSCommand({name: 'api-key', description: 'Api keys management.'})
export class ApiKeyCommand extends RWSBaseCommand {
  private logger = new Logger(this.constructor.name);
  constructor(
    protected readonly authService: AuthService,
  ) {    
    super();
  }    

  async run(
    passedParams: string[],
    options: ParsedOptions
  ): Promise<void> {
    const [username, command] = passedParams;
    const user: User = await User.findOneBy({ conditions: { username } });

    if(!user){
      throw new Error('Wrong username');
    }

    switch(command){
      case 'list': this.listKeys(user); return;
      case 'generate': this.generateKey(user); return;
      default: throw new Error('Wrong command try: "list" or "generate"');
    }    
  }

  private async listKeys(user: User){
    this.logger.log(`Listing keys for user: ${user.username}`);

    let i = 1;
    user.apiKeys.forEach(apiKey => {
      this.logger.log(`Key ${i}: ${apiKey.keyval}`);
      i++;
    });
  }

  private async generateKey(user: User){
    this.logger.log(`Generating key for user: ${user.username}`);

    const keyModel: ApiKey = new ApiKey({ keyval: 'sh-' + uuid() });
    keyModel.user = user;
    
    await keyModel.save(); 

    this.logger.log(`Key: ${keyModel.keyval}`);
  }
}
