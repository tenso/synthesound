"use strict";

/*global GUI*/

function GSliders(container, title) {
    GUI.containerInit(this, container, title);
}

GSliders.prototype.add = function (label, val, min, max, callback) {
    var cont = document.createElement("div"),
        sliderLabel = GUI.makeLabel(label),
        slider = GUI.makeSlider(label, val, min, max, callback);
    
    cont.appendChild(sliderLabel);
    cont.appendChild(slider);
    GUI.containerAddContent(this, cont);
        
    slider.setValue(val);
};