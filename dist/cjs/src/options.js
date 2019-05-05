"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = {
    isDebug: false,
    logFormatFn: function (message) {
        var timestamp = new Date();
        return "domain-wait[" + timestamp.toTimeString() + "]: " + message;
    },
    logFn: function (message) {
        var formattedMessage = exports.options.logFormatFn(message);
        console.log(formattedMessage);
    }
};
//# sourceMappingURL=options.js.map