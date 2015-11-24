"use strict";
/*global setMouseCapturer*/
/*global GUI*/
/*global Log*/

function GRadios(container, title) {
    GUI.containerInit(this, container, title);
    this.radioGroup = [];
}

/* Returns index of new button */
GRadios.prototype.add = function (label, callback, isRadio) {
    var button = GUI.makeButton(label, callback, isRadio, this.radioGroup);
    GUI.containerAddContent(this, button);
    
    return this.radioGroup.length - 1;
};

GRadios.prototype.set = function (index) {
    if (index < 0 || index >= this.radioGroup.length) {
        Log.error("index oob in GRadios");
        return;
    }
    this.radioGroup[index].set();
};

GRadios.prototype.setValue = function (index, value) {
    if (index < 0 || index >= this.radioGroup.length) {
        Log.error("index oob in GRadios");
        return;
    }
    this.radioGroup[index].setValue(value);
};