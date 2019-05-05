export interface IDomainWaitOptions {
    isDebug: boolean;
    logFormatFn: (message: string) => string;
    logFn: (message: string) => void;
}
export declare var options: IDomainWaitOptions;
