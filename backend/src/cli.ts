import 'reflect-metadata';

import { RWSCliBootstrap } from "@rws-framework/server";
import { config, IAppModuleOpts } from './config/config'

import { RWSConfigInjector } from "@rws-framework/server/nest";
import { AuthService } from './services/AuthService';

import { AdminStartCommand } from './commands/adminadd.command';
import { ApiKeyCommand } from './commands/apikey.command';

@RWSConfigInjector(config())
class AppCliBootstrap  extends RWSCliBootstrap {}

if (require.main === module) {    
    AppCliBootstrap.run<IAppModuleOpts>(config, {
      providers: [
        AuthService,
        AdminStartCommand,
        ApiKeyCommand
      ]
    }).catch((error) => {
        console.error('Failed to run CLI:', error);
        process.exit(1);
    });
}