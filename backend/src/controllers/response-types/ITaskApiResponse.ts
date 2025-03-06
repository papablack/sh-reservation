import { IXLSXProcessError } from "backend/src/services/XLSService"

export interface ITaskProcessApiResponse {
    success: boolean,
    data?: {
        taskId: string,
    },
    error?: string
}