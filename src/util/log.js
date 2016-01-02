"use strict";
/*global window*/

var log = {
    logData: [],
    logUpdated: undefined,
    
    error: function (msg) {
        return log.update("ERROR", msg);
    },

    info: function (msg) {
        return log.update("INFO", msg, true);
    },
    
    obj: function (obj) {
        log.logData.push(obj);
        return log.update();
    },
    
    d: function (msg) {
        return log.update("DBG", msg);
    },
    
    warn: function (msg) {
        return log.update("WARN", msg);
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
        return log;
    },
    
    logText: function () {
        return log.logData.join("\n");
    }
};