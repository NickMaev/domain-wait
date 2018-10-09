"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var domain = require("domain");
var domainContext = require("domain-context");
var constants_1 = require("./constants");
function isNode() {
    return typeof process === 'object' && process.versions && !!process.versions.node;
}
exports.isNode = isNode;
function getBaseUrl(url) {
    var noDomainBaseUrl = "";
    if (url) {
        if (domain.active) {
            domainContext.set(constants_1.domainTaskBaseUrlStateKey, url);
        }
        else {
            noDomainBaseUrl = url;
        }
    }
    return domain.active ? domainContext.get(constants_1.domainTaskBaseUrlStateKey) : noDomainBaseUrl;
}
exports.getBaseUrl = getBaseUrl;
function transformUrl(url) {
    if (isNode) {
        var base = getBaseUrl();
        if (url.startsWith("/")) {
            url = url.substring(1, url.length);
        }
        return base + url;
    }
    return url;
}
exports.transformUrl = transformUrl;
;
//# sourceMappingURL=utils.js.map