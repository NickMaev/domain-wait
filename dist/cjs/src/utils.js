"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var domain = require("domain");
var domainContext = require("domain-context");
var Constants_1 = require("./Constants");
function isNode() {
    return typeof process === 'object' && process.versions && !!process.versions.node;
}
exports.isNode = isNode;
function getBaseUrl(url) {
    var noDomainBaseUrl = "";
    if (url) {
        if (domain.active) {
            domainContext.set(Constants_1.domainTaskBaseUrlStateKey, url);
        }
        else {
            noDomainBaseUrl = url;
        }
    }
    return domain.active ? domainContext.get(Constants_1.domainTaskBaseUrlStateKey) : noDomainBaseUrl;
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
function getHashCode(string) {
    var hash = 0;
    for (var i = 0; i < string.length; i++) {
        var character = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash;
    }
    return hash;
}
exports.getHashCode = getHashCode;
//# sourceMappingURL=utils.js.map