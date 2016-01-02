"use strict";
/*global window*/

var log = {
    error: function (msg) {
        window.console.log("ERROR:" + msg);
    },

    info: function (msg) {
        window.console.log("INFO:" + msg);
    },
    
    obj: function (obj) {
        window.console.log(obj);
    },
    
    warn: function (msg) {
        window.console.log("WARN:" + msg);
    }
};