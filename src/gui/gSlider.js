"use strict";
/*global gui*/
/*global gBase*/

//FIXME: rewrite to use that.getH() and so on, not gui.getStyle...

function gKnob(min, max, callback) {
    var that = gBase(),
        value = 0;

    that.setValue = function (val, skipCallback) {
        var sliderH = gui.getStyleInt(that.parentNode, "height"),
            knobH = gui.getStyleInt(that, "height"),
            maxY;

        value = val;
        if (value > max) {
            value = max;
        } else if (value < min) {
            value = min;
        }
        maxY = sliderH - knobH;

        that.top((maxY - ((value - min) / (max - min)) * maxY));

        if (!skipCallback) {
            callback(value);
        }
    };

    that.getValue = function () {
        return value;
    };

    that.onmousedown = function (e) {
        gui.captureMouse(e);
    };

    that.iMousePressAndMove = function (e) {
        var maxY = that.parentNode.offsetHeight - that.offsetHeight,
            newY = gui.getStyleInt(that, "top") + e.movementY;

        if (newY < 0) {
            newY = 0;
        } else if (newY > maxY) {
            newY = maxY;
        }
        that.style.top = newY + "px";
        value = min + (max - min) * (1.0 - newY / maxY);
        callback(value);
    };

    that.typeIs = "gKnob";
    that.setClass("button-class gKnob").rel().top(0).h(20);
    return that;
}

function gSlider(val, min, max, callback) {
    var that = gBase(),
        knob = gKnob(min, max, callback);

    that.setValue = function (value, skipCallback) {
        knob.setValue(value, skipCallback);
        return that;
    };

    that.getValue = function () {
        return knob.getValue();
    };

    that.onmousedown = function (e) {
        that.setValue(max - (max - min) * (e.offsetY / that.offsetHeight));
    };

    that.setClass("gSlider").h(100).w(10);
    that.typeIs = "gSlider";
    that.add(knob);
    that.setValue(val, true);

    return that;
}
