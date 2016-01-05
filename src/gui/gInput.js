"use strict";
/*global gBase*/
/*global gLabel*/
/*global util*/

function gInput(value, callback, label, width) {
    var that = gBase().fontFamily("monospace"),
        input = gBase("input").w(width || 60).setClass("gInput").textAlign("center"),
        inLabel = gLabel(label);

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

    that.textAlign = function (align) {
        input.textAlign(align);
        return that;
    };

    that.labelPos = function (pos) {
        if (pos === "left") {
            inLabel.float("left");
            inLabel.marginRight(4);
        }
        return that;
    };

    input.value = value;
    input.onchange = function () {
        callback(input.value);
    };
    that.add(inLabel);
    that.add(input);
    input.typeIs = "gInput";
    return that;
}
