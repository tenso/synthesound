"use strict";
/*global window*/

var log = {
    logData: [],
    
    error: function (msg) {
        log.logData.push("ERROR:" + msg);
        window.console.log(log.logData[log.logData.length - 1]);
    },

    info: function (msg) {
        log.logData.push("INFO:" + msg);
        window.console.log(log.logData[log.logData.length - 1]);
    },
    
    obj: function (obj) {
        log.logData.push(obj);
        window.console.log(log.logData[log.logData.length - 1]);
    },
    
    warn: function (msg) {
        log.logData.push("WARN:" + msg);
        window.console.log(log.logData[log.logData.length - 1]);
    }
};