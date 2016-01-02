"use strict";
/*global window*/

var log = {
    logData: [],
    logUpdated: undefined,
    
    error: function (msg) {
        log.update("ERROR", msg);
    },

    info: function (msg) {
        log.update("INFO", msg, true);
    },
    
    obj: function (obj) {
        log.logData.push(obj);
        log.update();
    },
    
    warn: function (msg) {
        log.update("WARN", msg);
    },
    
    update: function (type, message, skipOutput) {
        if (type && message) {
            log.logData.push(type + ":" + message);
        }
        if (!skipOutput) {
            window.console.log(log.logData[log.logData.length - 1]);
        }
        if (typeof log.logUpdated === "function") {
            log.logUpdated();
        }
    },
    
    logText: function () {
        return log.logData.join("\n");
    }
};