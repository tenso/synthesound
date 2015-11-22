"use strict";

/*global gContainerInit*/
/*global gContainerAddContent*/

function GSliders(container, title) {
    gContainerInit(this, container, "hsliders", title);
}

GSliders.prototype.add = function (label, val, min, max, callback) {
    var cont = document.createElement("div"),
        sliderLabel = gMakeLabel(label),
        slider = gMakeSlider(label, val, min, max, callback);
    
    cont.appendChild(sliderLabel);
    cont.appendChild(slider);
    gContainerAddContent(this, cont);
        
    slider.setValue(val);
};