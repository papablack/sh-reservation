export interface ITaskProcessApiResponse {
    success: boolean,
    data?: {
        taskId: string,
    },
    error?: string
}