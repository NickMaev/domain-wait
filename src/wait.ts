import { domainTasksStateKey } from "./constants";
import { isNode, transformUrl } from "./utils";
import { IDomainTasksState } from "./IDomainTasksState";

import * as domain from 'domain';
import * as domainContext from 'domain-context';

export async function wait(task: (transformUrlFn: (url: string) => string) => Promise<any>) {
    
    if (!isNode()) {
        // In browser.
        await task(transformUrl);
        return;
    }

    if (task && domain.active) {
        const state = domainContext.get(domainTasksStateKey) as IDomainTasksState;
        if (state) {
            state.numRemainingTasks++;
            try {
                await task(transformUrl);

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