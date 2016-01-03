"use strict";
/*global log*/
/*global gBase*/

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
    var that = gBase();

    that.pressButton = function (value, skipCallback) {
        that.value = value;
        if (that.isRadio) {
            that.color(that.value ? "#fff" : "#888");
            if (!skipCallback && that.value) {
                that.callback(that.value);
            }
        } else if (!skipCallback) {
            that.callback(that.value);
        }
        return that;
    };

    that.set = function (skipCallback) {
        var i;
        if (isRadio) {
            for (i = 0; i < buttonGroup.length; i += 1) {
                if (buttonGroup[i].isRadio) {
                    buttonGroup[i].pressButton(buttonGroup[i] === that, skipCallback);
                }
            }
        } else {
            that.pressButton(!that.value, skipCallback);
        }
    };

    that.name = name;
    that.isRadio = isRadio;
    that.setClass("button-class");
    that.textContent = name;
    that.value = false;
    that.callback = callback;
    that.padding("1px 4px 1px 4px").lineHeight("100%").display("inline-block");


    if (that.isRadio) {
        if (buttonGroup) {
            buttonGroup.push(that);
        } else {
            log.error("gRadio: radiobuttons need collection");
        }
        that.color("#888");
    } else {
        that.color("#fff").pressEffect(true);
    }

    that.onmousedown = function (e) {
        e.stopPropagation();
        that.set();
    };
    that.typeIs = "gButton";
    return that;
}
