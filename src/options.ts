export interface IDomainWaitOptions {
    isDebug: boolean;
    logFormatFn: (message: string) => string;
    logFn: (message: string) => void;
}

export var options: IDomainWaitOptions = {
    isDebug: false,
    logFormatFn: (message) => {
        const timestamp = new Date();
        return `domain-wait[${timestamp.toTimeString()}]: ${message}`;
    },
    logFn: (message) => {
        const formattedMessage = options.logFormatFn(message);
        console.log(formattedMessage);
    }
};