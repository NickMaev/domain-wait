import { domainTasksStateKey } from "./constants";
import { isNode, transformUrl, getHashCode } from "./utils";
import { IDomainTasksState } from "./IDomainTasksState";

import * as domain from 'domain';
import * as domainContext from 'domain-context';
import {completedTasks} from "./completedTasks";

export async function wait(task: (transformUrlFn: (url: string) => string) => Promise<any>) {

    var taskHashCode = getHashCode(task.toString());

    if (!isNode()) {
        // In browser.
        var completedTasksKey = "completedTasks";
        var _completedTasks = window[completedTasksKey];
        if (_completedTasks) {
            var completedTaskIndex = _completedTasks.indexOf(taskHashCode);
            if (completedTaskIndex > -1) {
                _completedTasks.splice(completedTaskIndex, 1);
                window[completedTasksKey] = _completedTasks;
                return;
            }
        } else {
            console.log(
                `domain-wait: Array "window.${completedTasksKey
                }" not defined. Please define it to use the "wait" method. This will prevent fething your data twice.`);
        }
    }

    if (!isNode()) {
        // In browser.
        await task(transformUrl);
        return;
    }

    if (task && domain.active) {
        // In node.
        const state = domainContext.get(domainTasksStateKey) as IDomainTasksState;
        if (state) {
            state.numRemainingTasks++;
            try {
                await task(transformUrl);
                if (completedTasks.indexOf(taskHashCode) === -1) {
                    completedTasks.push(taskHashCode);
                }
                setTimeout(() => {
                    state.numRemainingTasks--;
                    if (state.numRemainingTasks === 0 && !state.hasIssuedSuccessCallback) {
                        state.hasIssuedSuccessCallback = true;
                        setTimeout(() => {
                            state.completionCallback(/* error */ null);
                        }, 0);
                    }
                }, 0);
            } catch (error) {
                state.completionCallback(error);
            }
        }
    }
}