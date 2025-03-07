import { DefaultLayout } from '../components/default-layout/component';
import { RWSClientInstance, declareRWSComponents } from '@rws-framework/client/src/client';

import { RouterComponent } from '@rws-framework/browser-router';
import { ShowTask } from '../components/task/component';

export default () => {
    declareRWSComponents();
    RouterComponent;
    DefaultLayout;    
    ShowTask;

    RWSClientInstance.defineAllComponents();
};