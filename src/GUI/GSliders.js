"use strict";
/*global setMouseCapturer*/
/*global getStyle*/
/*global getStyleInt*/

function GSliders(container, title) {
    this.container = container;
    this.title = title;
    this.contId = container.id;
    this.classId = "hslider";
    this.table = document.createElement("table");
    this.table.id = this.classId + "-component-" + this.contId;
    this.table.className = "collection-table component";

    this.container.appendChild(this.table);
    
    var titleRow = document.createElement("tr"),
        titleElem = document.createElement("td");
    
    titleRow.id = this.classId + "-title-row-" + this.contId;
    titleElem.id = this.classId + "-title-elem-" + this.contId;
    
    titleElem.id = this.classId + "-title-" + this.contId;
    titleElem.innerText = this.title;
    titleElem.className = "label";
    titleElem.colSpan = 10000;
    titleRow.appendChild(titleElem);
    this.table.appendChild(titleRow);
    
    this.sliders = document.createElement("tr");
    this.sliders.id = this.classId + "-sliders-" + this.contId;
    this.table.appendChild(this.sliders);
}

GSliders.prototype.makeSlider = function (id, val, min, max, callback) {
    var track = document.createElement("div"),
        knob = document.createElement("div");
    
    knob.className = "button-class knob hslider-knob";
    knob.style.position = "relative";
        
    knob.id = this.classId + "-knob-" + this.contId + "-" + id;
    knob.value = val;
    knob.min = min;
    knob.max = max;
    knob.callback = callback;
    
    knob.onmousedown = function (e) {
        setMouseCapturer(e);
    };
    
    knob.onmousepressandmove = function (e) {
        var maxY = e.mouseCapturer.parentElement.offsetHeight - e.mouseCapturer.offsetHeight,
            newY = parseInt(e.mouseCapturer.style.top, 10) + e.movementY;
            
        if (newY < 0) {
            newY = 0;
        } else if (newY > maxY) {
            newY = maxY;
        }
        e.mouseCapturer.style.top = newY + "px";
        e.mouseCapturer.value = min + (max - min) * (1.0 - newY / maxY);
        e.mouseCapturer.callback(e.mouseCapturer.value);
    };
    
    knob.setValue = function (value) {
        var sliderH = getStyleInt(this.parentElement, "height"),
            knobH = getStyleInt(knob, "height"),
            maxY;
                
        this.value = value;
        if (this.value > this.max) {
            this.value = this.max;
        } else if (this.value < this.min) {
            this.value = this.min;
        }
        maxY = sliderH - knobH;
        
        this.style.top = (maxY - ((this.value - this.min) / (this.max - this.min)) * maxY) + "px";
        this.callback(this.value);
    };
    
    track.id = this.classId + "-track-" + this.contId + "-" + id;
    track.className = this.classId + "-track track";
    track.knob = knob;
    track.onmousedown = function (e) {
        this.knob.setValue(this.knob.max - (this.knob.max - this.knob.min) * (e.offsetY / this.offsetHeight));
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
            
    sliderLabel.id = this.classId + "-label-" + this.contId + "-" + label;
    sliderLabel.innerText = label;
    sliderLabel.className = "component-label";
    cont.appendChild(sliderLabel);
    
    cont.appendChild(slider);
    
    this.sliders.appendChild(cont);
    
    //FIXME: ugly set initial pos...
    knob = document.getElementById(this.classId + "-knob-" + this.contId + "-" + label);
    knob.setValue(knob.value);
};