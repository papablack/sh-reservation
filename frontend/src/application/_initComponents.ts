import { DefaultLayout } from '../components/default-layout/component';
import { RWSClientInstance } from '@rws-framework/client/src/client';


import { RouterComponent } from '@rws-framework/browser-router';

export default () => {
    RouterComponent;
    DefaultLayout;
    RWSClientInstance.defineAllComponents();
};