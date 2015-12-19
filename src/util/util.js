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
    }
};