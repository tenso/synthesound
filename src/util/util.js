/*jslint node: true */

/*global test*/
/*global log*/

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

    msToString: function (ms) {
        var seconds = parseInt(ms / 1000.0, 10);
        return util.zeroPad(seconds / 60) + ":" + util.zeroPad(seconds % 60) + ":" + util.zeroPad((ms % 1000) / 10);
    },

    stringToMs: function (str) {
        var group = str.split(":"),
            value = 0;

        if (group.length >= 1) {
            value += 60000 * parseInt(group[0], 10);
        }
        if (group.length >= 2) {
            value += 1000 * parseInt(group[1], 10);
        }
        if (group.length >= 3) {
            value += 10 * parseInt(group[2], 10);
        }
        if (!isFinite(value)) {
            return 0;
        }
        return value;
    },

    /*NOTE: to fool jslint for function arguments only!*/
    unused: function (arg) {
        return arg;
    },

    setArgs: function (obj, args) {
        var key,
            mod = false;

        if (obj && args) {
            for (key in args) {
                if (args.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === typeof args[key] && typeof obj[key] !== "function") {
                        obj[key] = args[key];
                        mod = true;
                    } else {
                        log.error("uncompatible arguments:" + key + " " + typeof obj[key] + " vs " + typeof args[key]);
                        log.obj(obj);
                        log.obj(args);
                    }
                }
            }
        }
        return mod;
    },

    tests: {
        test_msToString: function () {
            test.verify(util.msToString(1000), "00:01:00");
            test.verify(util.msToString(62000), "01:02:00");
            test.verify(util.msToString(120220), "02:00:22");
            test.verify(util.msToString(3600000), "60:00:00");
        },

        test_stringToMs: function () {
            test.verify(util.stringToMs("00:01:00"), 1000);
            test.verify(util.stringToMs("01:02:00"), 62000);
            test.verify(util.stringToMs("02:00:22"), 120220);
            test.verify(util.stringToMs("60:00:00"), 3600000);

            test.verify(util.stringToMs("60"), 3600000);
            test.verify(util.stringToMs("60:10"), 3610000);
            test.verify(util.stringToMs("a:b"), 0);
        }
    },

    copyData: function (obj) {
        var that = {},
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] !== "function") {
                that[key] = obj[key];
            }
        }
        return that;
    },

    addMethod: function (obj, name, func) {
        if (obj[name]) {
            log.error("already have:" + name);
        } else {
            obj[name] = func;
        }
        return obj;
    }
};

test.addTests(util, "util");
