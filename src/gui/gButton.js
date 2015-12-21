"use strict";
/*global gui*/
/*global log*/
/*global gBase*/

function gButton(name, callback, isRadio, buttonCollection) {
    var that = gBase();
    that.isRadio = isRadio;
    that.className = "button-class gButton";
    that.textContent = name;
    that.style.position = "relative";
    that.value = false;
    that.callback = callback;

    if (that.isRadio) {
        if (buttonCollection) {
            that.siblings = buttonCollection;
            that.siblings.push(that);
        } else {
            log.error("gRadio: radiobuttons need collection");
        }
        that.className += " gButtonRadioInactive";
    }
    
    that.onmousedown = function (e) {
        e.stopPropagation();
        this.set();
    };

    that.set = function () {
        var i;
        if (this.isRadio) {
            for (i = 0; i < this.siblings.length; i += 1) {
                if (this.siblings[i].isRadio) {
                    this.siblings[i].setValue(this.siblings[i] === this);
                }
            }
        } else {
            this.setValue(!this.value);
        }
        return this;
    };
    
    that.setValue = function (value) {
        this.value = value;
        if (this.isRadio) {
            this.className = "button-class gButton " + (this.value ? "gButtonRadioActive" : "gButtonRadioInactive");
            if (this.value) {
                this.callback(this.value);
            }
        } else {
            this.callback(this.value);
        }
        return this;
    };

    return that;
}