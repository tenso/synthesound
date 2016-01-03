"use strict";

var util = {
    isArray: function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    },

    isObject: function (obj) {
        return Object.prototype.toString.call(obj) === "[object Object]";
    },

    isCollection: function (obj) {
        return util.isArray(obj) || util.isObject(obj);
    },

    zeroPad: function (value) {
        if (value < 10) {
            return "0" + parseInt(value, 10);
        }
        return parseInt(value, 10);
    },

    /*NOTE: to fool jslint for function arguments only!*/
    unused: function (arg) {
        return arg;
    }
};
