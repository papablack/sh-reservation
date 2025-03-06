import { IHTTProute } from "@rws-framework/server/src/routing/routes";

export const taskRoutes: IHTTProute[] = [                
    {
        name: 'task.process',
        path: '/process',
        method: 'POST'                
    },      
    {
        name: 'task.status',
        path: '/status/:taskId',
        method: 'GET'                
    }                  
]