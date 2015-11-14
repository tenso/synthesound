"use strict";

function GSliders(container) {
    this.sliders = [];
    this.container = container;
    
    this.box = document.createElement("tr");
    this.box.className = "box";
    this.container.appendChild(this.box);
}

GSliders.prototype.add = function (id, val, min, max, callback) {
    var cont = document.createElement("td"),
        sliderLabel = document.createElement("div"),
        nextSlider = document.createElement("input");
            
    sliderLabel.innerText = id;
    sliderLabel.className = "h-slider-label";
    cont.appendChild(sliderLabel);
    
    nextSlider.type = "range";
    nextSlider.id = id;
    nextSlider.min = min;
    nextSlider.max = max;
    nextSlider.step = 0.01;
    nextSlider.className = "h-slider";
    nextSlider.value = val;
    nextSlider.oninput = callback;
    cont.appendChild(nextSlider);
    
    this.box.appendChild(cont);
};