"use strict";
/*global gui*/
/*global gBase*/
/*global gui*/
/*global util*/

function gKnob(min, max, callback, horizontal) {
    var that = gBase(),
        value = 0;

    that.setValue = function (val, skipCallback) {
        var maxCoord;

        value = val;
        if (value > max) {
            value = max;
        } else if (value < min) {
            value = min;
        }
        if (horizontal) {
            maxCoord = that.parentNode.getW() - that.getW() - 1;
            that.left((value - min) / (max - min) * maxCoord);
        } else {
            maxCoord = that.parentNode.getH() - that.getH() - 1;
            that.top((maxCoord - ((value - min) / (max - min)) * maxCoord));
        }

        if (!skipCallback && typeof callback === "function") {
            callback(value);
        }
        return that;
    };

    that.getValue = function () {
        return value;
    };

    that.onmousedown = function (e) {
        gui.captureMouse(e);
    };

    that.iMousePressAndMove = function (e, mouse) {
        var maxCoord,
            newCoord;

        util.unused(e);

        if (horizontal) {
            maxCoord = that.parentNode.getW() - that.getW();
            newCoord = mouse.offsetInParent.x - mouse.captureOffsetInElement.x;
        } else {
            maxCoord = that.parentNode.getH() - that.getH();
            newCoord = mouse.offsetInParent.y - mouse.captureOffsetInElement.y;
        }

        if (newCoord < 0) {
            newCoord = 0;
        } else if (newCoord > maxCoord) {
            newCoord = maxCoord;
        }

        if (horizontal) {
            that.setValue(min + (max - min) * (newCoord / maxCoord));
        } else {
            that.setValue(min + (max - min) * (1.0 - newCoord / maxCoord));
        }
    };

    that.typeIs = "gKnob";
    that.setClass("button-class").rel().top(0).border("1px solid #000");

    if (horizontal) {
        that.w(20).h(9);
    } else {
        that.h(20);
    }

    return that;
}

function gSlider(val, min, max, callback, horizontal) {
    var that = gBase(),
        knob = gKnob(min, max, callback, horizontal);

    that.setValue = function (value, skipCallback) {
        return knob.setValue(value, skipCallback);
    };

    that.getValue = function () {
        return knob.getValue();
    };

    that.onmousedown = function (e) {
        var coord = horizontal ? (e.offsetX / that.offsetWidth) : (e.offsetY / that.offsetHeight);
        if (horizontal) {
            that.setValue(max - (max - min) * (1.0 - coord));
        } else {
            that.setValue(max - (max - min) * coord);
        }
    };

    if (horizontal) {
        that.h(10).w(100);
    } else {
        that.h(100).w(10);
    }
    that.bg("#aaa").border("1px solid #000").radius(4);
    that.typeIs = "gSlider";
    that.add(knob);
    that.setValue(val, true);

    return that;
}
