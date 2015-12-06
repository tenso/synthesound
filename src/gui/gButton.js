"use strict";
/*global gui*/

function gButton(name, callback, isRadio, buttonCollection) {
    var button = document.createElement("div");
    button.siblings = buttonCollection;
    button.siblings.push(button);
    button.isRadio = isRadio;

    button.className = "button-class radiobutton-inactive";
    button.innerText = name;
    button.style.position = "relative";
    button.classId = "radiobutton";
    button.value = false;
    button.callback = callback;

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
    };

    return button;
}