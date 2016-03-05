/*jslint node: true */

/*global test*/
/*global log*/

"use strict";

//FIXME: rename to eventHandler
function event(base) {
    var that = base || {},
        listeners = {};

    that.on = function (eventName, func) {
        if (typeof func !== "function") {
            log.error("event.on: not a function for eventName:" + eventName);
            return;
        }
        if (!listeners.hasOwnProperty(eventName)) {
            listeners[eventName] = [];
        }
        listeners[eventName].push(func);
    };

    that.removeOn = function (eventName) {
        if (!listeners.hasOwnProperty(eventName)) {
            log.error("no such event:" + eventName);
            return;
        }
        delete listeners[eventName];
    };

    that.emit = function (eventName) {
        var args = Array.prototype.slice.call(arguments, 1),
            cb,
            i;
        if (listeners.hasOwnProperty(eventName)) {
            for (i = 0; i < listeners[eventName].length; i += 1) {
                listeners[eventName][i].apply(undefined, args);
            }
        }
    };

    return that;
}

function test_event() {
    function testObj() {
        var that = {},
            func1run = 0,
            func2run = 0;

        that.func1 =  function () {
            func1run += 1;
        };

        that.func2 =  function () {
            func2run += 1;
            that.pubArg += 1;
        };

        that.allRun = function () {
            return func1run + func2run + that.pubArg;
        };

        that.pubArg = false;

        return that;
    }

    var obj = testObj(),
        e = event(obj);

    e.on("signal1", obj.func1);
    e.on("signal1", obj.func2);
    test.verify(obj.allRun(), 0);
    e.emit("signal1");
    test.verify(obj.allRun(), 3);
}

test.addTest(test_event, "event");
