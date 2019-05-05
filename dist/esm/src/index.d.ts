export interface IData {
    completedTasks: number[];
}
export interface BootFuncParams {
    data: any;
}
export declare function connect(nodeServicesBootFuncParams: BootFuncParams): void;
export declare function getCompletedTasks(): number[];
export declare function wait(task: (transformUrlFn: (url: string) => string) => Promise<any>): Promise<void>;
