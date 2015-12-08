"use strict";
/*global gui*/
/*global log*/
/*global gBase*/

function gButton(name, callback, isRadio, buttonCollection) {
    var button = gBase();
    button.isRadio = isRadio;
    button.className = "button-class";
    button.innerText = name;
    button.style.position = "relative";
    button.classId = "radiobutton";
    button.value = false;
    button.callback = callback;

    if (button.isRadio) {
        if (buttonCollection) {
            button.siblings = buttonCollection;
            button.siblings.push(button);
        } else {
            log.error("gRadio: radiobuttons need collection");
        }
        button.className += " radiobutton-inactive";
    }
    
    button.onmousedown = function (e) {
        e.stopPropagation();
        this.set();
    };

    button.set = function () {
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
    button.setValue = function (value) {
        this.value = value;
        this.className = "button-class " + (this.value ? this.classId + "-active" : this.classId + "-inactive");
        if (this.isRadio) {
            if (this.value) {
                this.callback(this.value);
            }
        } else {
            this.callback(this.value);
        }
        return this;
    };

    return button;
}