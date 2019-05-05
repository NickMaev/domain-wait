export var options = {
    isDebug: false,
    logFormatFn: function (message) {
        var timestamp = new Date();
        return "domain-wait[" + timestamp.toTimeString() + "]: " + message;
    },
    logFn: function (message) {
        var formattedMessage = options.logFormatFn(message);
        console.log(formattedMessage);
    }
};
//# sourceMappingURL=options.js.map