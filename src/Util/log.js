"use strict";

var log = {
    error: function (msg) {
        window.console.log("ERROR:" + msg);
        window.alert("ERROR:" + msg);
    },

    info: function (msg) {
        window.console.log("INFO:" + msg);
    }
};