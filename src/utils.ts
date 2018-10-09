import * as domain from 'domain';
import * as domainContext from 'domain-context';

import { domainTaskBaseUrlStateKey } from "./constants";

declare var process: any;

export function isNode(): boolean {
   return typeof process === 'object' && process.versions && !!process.versions.node;
}

export function getBaseUrl(url?: string): string {
    let noDomainBaseUrl: string;
    if (url != null) {
        if (domain.active) {
            // There's an active domain (e.g., in Node.js), so associate the base URL with it.
            domainContext.set(domainTaskBaseUrlStateKey, url);
        } else {
            // There's no active domain (e.g., in browser), so there's just one shared base URL.
            noDomainBaseUrl = url;
        }
    }
    return domain.active ? domainContext.get(domainTaskBaseUrlStateKey) : noDomainBaseUrl;
}

export function transformUrl(url: string) {
    if (isNode) {
        var base = getBaseUrl();
        if (url.startsWith("/")) {
            url = url.substring(1, url.length);
        }
        return base + url;
    }
    return url;
};