"use strict";
/*global log*/
/*global gBase*/
/*global gui*/

function gButtonGroup() {
    var that = [];

    that.setValue = function (buttonName, skipCallback) {
        var i;
        for (i = 0; i < that.length; i += 1) {
            if (that[i].name === buttonName) {
                that[i].set(skipCallback);
            }
        }
    };

    return that;
}

function gButton(name, callback, isRadio, buttonGroup) {
    var that = gBase(),
        value = false,
        colorActive = "#fff",
        color = "#888";

    that.setColor = function (inactive, active) {
        color = inactive;
        colorActive = active;
        that.color(value ? colorActive : color);
    };

    that.getValue = function () {
        return value;
    };

    that.setValue = function (newValue, skipCallback) {
        value = newValue;
        if (that.isRadio) {
            that.color(value ? colorActive : color);
            if (!skipCallback) {
                if (buttonGroup && buttonGroup.length) {
                    if (value) {
                        that.callback(value);
                    }
                } else {
                    that.callback(value);
                }
            }
        } else if (!skipCallback) {
            that.callback(value);
        }
        return that;
    };

    that.set = function (skipCallback) {
        var i;
        if (isRadio && buttonGroup && buttonGroup.length) {
            for (i = 0; i < buttonGroup.length; i += 1) {
                if (buttonGroup[i].isRadio) {
                    buttonGroup[i].setValue(buttonGroup[i] === that, skipCallback);
                }
            }
        } else {
            that.setValue(!value, skipCallback);
        }
    };

    that.setTitle = function (title) {
        that.textContent = title;
        return that;
    };

    that.name = name;
    that.isRadio = isRadio;
    that.setClass("button-class");
    that.textContent = name;
    that.callback = callback;
    that.padding("1px 4px 1px 4px").lineHeight("100%").display("inline-block");

    if (that.isRadio) {
        if (buttonGroup) {
            buttonGroup.push(that);
        }
        that.color(color);
    } else {
        that.color(colorActive).pressEffect(true);
    }

    that.onmousedown = function (e) {
        gui.captureMouse(e);
    };

    that.iMouseCaptured = function (e) {
        that.set();
    };

    that.typeIs = "gButton";
    return that;
}
