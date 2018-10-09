import * as domain from 'domain';
import * as domainContext from 'domain-context';
import { domainTaskBaseUrlStateKey } from "./constants";
export function isNode() {
    return typeof process === 'object' && process.versions && !!process.versions.node;
}
export function getBaseUrl(url) {
    var noDomainBaseUrl;
    if (url != null) {
        if (domain.active) {
            domainContext.set(domainTaskBaseUrlStateKey, url);
        }
        else {
            noDomainBaseUrl = url;
        }
    }
    return domain.active ? domainContext.get(domainTaskBaseUrlStateKey) : noDomainBaseUrl;
}
export function transformUrl(url) {
    if (isNode) {
        var base = getBaseUrl();
        if (url.startsWith("/")) {
            url = url.substring(1, url.length);
        }
        return base + url;
    }
    return url;
}
;
//# sourceMappingURL=utils.js.map