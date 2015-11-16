"use strict";
/*global setMouseCapturer*/
/*global getStyle*/
/*global getStyleInt*/

function GSliders(container) {
    this.sliders = [];
    this.container = container;
    
    this.box = document.createElement("tr");
    this.box.className = "box";
    this.container.appendChild(this.box);
}

GSliders.prototype.makeSlider = function (id, val, min, max, callback) {
    var track = document.createElement("div"),
        knob = document.createElement("div");
    
    knob.className = "h-slider-knob";
    knob.isDown = false;
    knob.style.position = "relative";
        
    knob.id = "h-slider-knob-" + id;
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
    
    track.id = "h-slider-track-" + id;
    track.className = "h-slider-track";
    track.knob = knob;
    track.onmousedown = function (e) {
        e.target.knob.setValue(1.0 - (e.offsetY / e.target.offsetHeight));
    };
    
    track.appendChild(knob);
        
    return track;
};

GSliders.prototype.add = function (id, val, min, max, callback) {
    var cont = document.createElement("td"),
        sliderLabel = document.createElement("div"),
        slider = this.makeSlider(id, val, min, max, callback),
        knob,
        knobPos,
        maxY;
            
    sliderLabel.innerText = id;
    sliderLabel.className = "h-slider-label";
    cont.appendChild(sliderLabel);
    
    cont.appendChild(slider);
    
    this.box.appendChild(cont);
    
    //FIXME: ugly set initial pos...
    knob = document.getElementById("h-slider-knob-" + id);
    knob.setValue(knob.value);
};