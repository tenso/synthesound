"use strict";
/*global gui*/
/*global gBase*/

function gKnob(min, max, callback) {
    var that = gBase(),
        value = 0;

    that.setValue = function (val, skipCallback) {
        var sliderH = gui.getStyleInt(that.parentElement, "height"),
            knobH = gui.getStyleInt(that, "height"),
            maxY;

        value = val;
        if (value > max) {
            value = max;
        } else if (value < min) {
            value = min;
        }
        maxY = sliderH - knobH;

        that.style.top = (maxY - ((value - min) / (max - min)) * maxY) + "px";

        if (!skipCallback) {
            callback(value);
        }
    };

    that.getValue = function () {
        return value;
    };

    that.className = "button-class gKnob";
    that.style.position = "relative";
    that.style.top = "0px";
    that.style.height = "25px";

    that.onmousedown = function (e) {
        gui.captureMouse(e);
    };

    that.iMousePressAndMove = function (e) {
        var maxY = that.parentElement.offsetHeight - that.offsetHeight,
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

    that.className = "gSlider";
    that.style.height = "100px";

    that.onmousedown = function (e) {
        that.setValue(max - (max - min) * (e.offsetY / that.offsetHeight));
    };

    that.appendChild(knob);
    that.setValue(val, true);
    that.typeIs = "gSlider";
    return that;
}
