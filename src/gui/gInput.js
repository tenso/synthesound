"use strict";
/*global gBase*/
/*global gLabel*/
/*global util*/

function gInput(value, callback, label) {
    var that = gBase(),
        input = gBase("input").w(60).setClass("gInput").textAlign("right");

    that.setValue = function (value, skipCallback) {
        util.unused(skipCallback);
        input.value = value;
    };

    that.getValue = function () {
        return input.value;
    };

    that.getValueInt = function () {
        return parseInt(input.value, 10);
    };

    that.getValueFloat = function () {
        return parseFloat(input.value);
    };

    input.value = value;

    input.onchange = function () {
        callback(input.value);
    };

    that.add(gLabel(label));
    that.add(input);
    input.typeIs = "gInput";
    return that;
}
