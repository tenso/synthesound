"use strict";
/*global gBase*/
/*global gLabel*/
/*global util*/

function gInput(value, callback, label, width, type) {
    var that = gBase().fontFamily("monospace"),
        input = gBase("input").w(width || 60).setClass("gInput").textAlign("center"),
        inLabel = gLabel(label);

    input.type = type || "";

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

    that.disabled = function (value) {
        input.disabled = value;
        /*
        if (value) {
            input.disabled = true;
        } else {
            input.disabled = false;
        }*/
    };

    input.value = value;
    input.onchange = function () {
        if (typeof callback === "function") {
            callback(input.value);
        }
    };
    that.add(inLabel);
    that.add(input);
    input.typeIs = "gInput";
    return that;
}
