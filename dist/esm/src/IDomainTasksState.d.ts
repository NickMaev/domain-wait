export interface IDomainTasksState {
    numRemainingTasks: number;
    hasIssuedSuccessCallback: boolean;
    completionCallback: (error: any) => void;
}
