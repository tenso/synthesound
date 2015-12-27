"use strict";
/*global gui*/
/*global log*/
/*global gBase*/

function gButtonGroup() {
    var that = [];
    
    that.setValue = function (buttonName) {
        var i;
        for (i = 0; i < that.length; i += 1) {
            if (that[i].name === buttonName) {
                that[i].set();
            }
        }
    };
    
    return that;
}

function gButton(name, callback, isRadio, buttonGroup) {
    var that = gBase();
        
    that.pressButton = function (value) {
        that.value = value;
        if (that.isRadio) {
            that.className = "button-class gButton " + (that.value ? "gButtonRadioActive" : "gButtonRadioInactive");
            if (that.value) {
                that.callback(that.value);
            }
        } else {
            that.callback(that.value);
        }
        return that;
    };

    that.set = function () {
        var i;
        if (isRadio) {
            for (i = 0; i < buttonGroup.length; i += 1) {
                if (buttonGroup[i].isRadio) {
                    buttonGroup[i].pressButton(buttonGroup[i] === that);
                }
            }
        } else {
            that.pressButton(!that.value);
        }
    };
    
    that.name = name;
    that.isRadio = isRadio;
    that.className = "button-class gButton";
    that.textContent = name;
    that.style.position = "relative";
    that.value = false;
    that.callback = callback;
    
    if (that.isRadio) {
        if (buttonGroup) {
            buttonGroup.push(that);
        } else {
            log.error("gRadio: radiobuttons need collection");
        }
        that.className += " gButtonRadioInactive";
    }
    
    that.onmousedown = function (e) {
        e.stopPropagation();
        that.set();
    };
    
    return that;
}