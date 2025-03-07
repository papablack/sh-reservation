import {  IPrefixedHTTProutes } from '@rws-framework/server/src/routing/routes';
import { homeRoutes } from './actions/homeActions';
import { userRoutes } from './actions/userActions';
import { taskRoutes } from './actions/taskActions';

export default [
    {
        prefix: '/',
        controllerName: 'home',
        routes: homeRoutes
    },
    {
        prefix: '/users',
        controllerName: 'user',
        routes: userRoutes
    },
    {
        prefix: '/booking',
        controllerName: 'booking',
        exportAutoRoutes: true,
        routes: []
    },
    {
        prefix: '/task',
        controllerName: 'task',
        routes: taskRoutes
    }
] as IPrefixedHTTProutes[];
