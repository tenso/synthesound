"use strict";
/*global setMouseCapturer*/
/*global getStyle*/
/*global getStyleInt*/

function GSliders(container, title) {
    this.sliders = [];
    this.container = container;
    this.title = title;
    this.contId = container.id;
    
    this.box = document.createElement("tr");
    this.box.className = "box";
    this.container.appendChild(this.box);
    
    var titleElem = document.createElement("div");
    titleElem.innerText = this.title;
    titleElem.className = "h-slider-title";
    this.box.appendChild(titleElem);
}

GSliders.prototype.makeSlider = function (id, val, min, max, callback) {
    var track = document.createElement("div"),
        knob = document.createElement("div");
    
    knob.className = "h-slider-knob";
    knob.isDown = false;
    knob.style.position = "relative";
        
    knob.id = "h-slider-knob-" + this.contId + "-" + id;
    knob.value = val;
    knob.min = min;
    knob.max = max;
    knob.callback = callback;
    
    knob.onmousedown = function (e) {
        e.stopPropagation();
        setMouseCapturer(e);
    };
    
    knob.mouseMove = function (target, dx, dy) {
        var maxY = target.parentElement.offsetHeight - target.offsetHeight,
            newY = parseInt(target.style.top, 10) + dy;
            
        if (newY < 0) {
            newY = 0;
        } else if (newY > maxY) {
            newY = maxY;
        }
        target.style.top = newY + "px";
        target.value = min + (max - min) * (1.0 - newY / maxY);
        target.callback(target.value);
    };
    
    knob.setValue = function (value) {
        var sliderH = getStyleInt(this.parentElement, "height"),
            knobH = getStyleInt(knob, "height"),
            maxY;
        
        this.value = value;
        maxY = sliderH - knobH;
        this.style.top = (maxY - ((this.value - this.min) / (this.max - this.min)) * maxY) + "px";
        this.callback(this.value);
    };
    
    track.id = "h-slider-track-" + this.contId + "-" + id;
    track.className = "h-slider-track";
    track.knob = knob;
    track.onmousedown = function (e) {
        e.target.knob.setValue(1.0 - (e.offsetY / e.target.offsetHeight));
    };
    
    track.appendChild(knob);
        
    return track;
};

GSliders.prototype.add = function (label, val, min, max, callback) {
    var cont = document.createElement("td"),
        sliderLabel = document.createElement("div"),
        slider = this.makeSlider(label, val, min, max, callback),
        knob,
        knobPos,
        maxY;
            
    sliderLabel.innerText = label;
    sliderLabel.className = "h-slider-label";
    cont.appendChild(sliderLabel);
    
    cont.appendChild(slider);
    
    this.box.appendChild(cont);
    
    //FIXME: ugly set initial pos...
    knob = document.getElementById("h-slider-knob-" + this.contId + "-" + label);
    knob.setValue(knob.value);
};