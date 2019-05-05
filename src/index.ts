import { domainTasksStateKey, completedTasksKey } from "./Constants";
import { isNode, transformUrl, getHashCode } from "./utils";
import { IDomainTasksState } from "./IDomainTasksState";

import * as domain from 'domain';
import * as domainContext from 'domain-context';
import { options } from "./options";

const log = (message: string) => {
    if (options.isDebug === true) {
        if (options.logFn) {
            options.logFn(message);
        }
    }
};

var nodeData: IData = null;

export interface IData {
    completedTasks: number[];
}

export interface BootFuncParams {
    data: any;
}

/**
 * Connect 'domain-wait' library with the NodeServices params.
 * @param nodeServicesBootFuncParams 'params' argument of the function 'createServerRenderer'.
 */
export function connect(nodeServicesBootFuncParams: BootFuncParams): void {
    if (!nodeServicesBootFuncParams) {
        throw Error(`"bootFuncParamsData" is null.`);
    }
    if (!nodeServicesBootFuncParams.data) {
        nodeServicesBootFuncParams.data = {
            completedTasks: []
        };
    }
    nodeData = nodeServicesBootFuncParams.data;
    if (!nodeData.completedTasks) {
        nodeData.completedTasks = [];
    }
}

/**
 * Get hash codes of completed tasks.
 * */
export function getCompletedTasks(): number[] {
    if (isNode()) {
        if (!nodeData || !nodeData.completedTasks) {
            return [];
        }
        return nodeData.completedTasks;
    }
    return window[completedTasksKey];
}

/**
 * Wait for the asynchronous function in NodeServices prerender process.
 * @param task Asynchronous function. Use the 'transformUrlFn' function in internal requests (in your web application) for the URL transformation.
 */
export async function wait(task: (transformUrlFn: (url: string) => string) => Promise<any>) {

    if (!task) {
        throw Error(`"task" is null.`)
    }

    var taskHashCode = getHashCode(task.toString());

    log(`Start executing task "${taskHashCode}".\nFunction:\n ${task.toString()}`);

    if (!isNode()) {

        // In browser.

        log(`Executing task "${taskHashCode}" in browser.`);

        var _completedTasks = window[completedTasksKey];
        if (_completedTasks) {
            var completedTaskIndex = _completedTasks.indexOf(taskHashCode);
            if (completedTaskIndex > -1) {
                // Prevent execution of the task that was completed in Node.
                log(`Prevent execution task "${taskHashCode}" in browser.`);
                _completedTasks.splice(completedTaskIndex, 1);
                window[completedTasksKey] = _completedTasks;
                return;
            }
        } else {
            console.log(
                `domain-wait: Array "window.${completedTasksKey
                }" not defined. Please define it to use the "wait" method. This will prevent fething your data twice.`);
        }

        await task(transformUrl);

        log(`Task "${taskHashCode}" completed in browser.\nCompleted Node tasks: ${JSON.stringify(_completedTasks)}`);

    } else if (domain.active) {

        // In Node.

        if (!domainContext) {
            log(`Critical error while executing task "${taskHashCode}" in Node.`);
            throw Error("Domain context of the NodeServices has been lost. Possibly you try to acquire it in incorrect way.");
        }

        const state = domainContext.get(domainTasksStateKey) as IDomainTasksState;

        if (!state) {
            log(`Critical error while executing task "${taskHashCode}" in Node.`);
            return;
        }

        state.numRemainingTasks++;

        try {

            log(`Executing task "${taskHashCode}" asynchronously in Node.`);

            // Execute task asynchronously in Node.
            await task(transformUrl);

            if (nodeData.completedTasks.indexOf(taskHashCode) === -1) {
                nodeData.completedTasks.push(taskHashCode);
            }

            log(`Task "${taskHashCode}" completed in Node.`);

            setTimeout(() => {

                state.numRemainingTasks--;

                if (state.numRemainingTasks === 0 && !state.hasIssuedSuccessCallback) {

                    // All tasks completed successfully.

                    state.hasIssuedSuccessCallback = true;

                    setTimeout(() => {
                        state.completionCallback(null);
                    }, 0);
                }

            }, 0);

        } catch (error) {
            log(`Error while executing task "${taskHashCode}" in Node.`);
            state.completionCallback(error);
        }
    }

    return;
}