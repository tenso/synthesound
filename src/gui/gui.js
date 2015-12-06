"use strict";
/*global input*/
/*global log*/

var gui = {
    getPos: function (element) {
        var x = element.offsetLeft,
            y = element.offsetTop;

        while (element.offsetParent) {
            element = element.offsetParent;
            x += element.offsetLeft;
            y += element.offsetTop;
        }

        return {"x": x, "y": y};
    },
    
    getEventOffsetInElement: function (element, event) {
        var pos = gui.getPos(element);
        return {"x": event.clientX - pos.x, "y": event.clientY - pos.y};
    },
    
    getSize: function (elem) {
        var w = elem.offsetWidth,
            h = elem.offsetHeight;

        return {"w": w, "h": h};
    },

    getStyle: function (element, property) {
        if (element.style[property]) {
            return element.style[property];
        }
        return window.getComputedStyle(element, undefined).getPropertyValue(property);
    },

    getStyleInt: function (element, property) {
        return parseInt(gui.getStyle(element, property), 10);
    },
    


    makeSlider: function (val, min, max, callback) {
        var track = document.createElement("div"),
            knob = document.createElement("div");

        knob.className = "button-class knob hslider-knob";
        knob.style.position = "relative";
        knob.style.top = "0px";
        knob.style.height = "25px";
        knob.min = min;
        knob.max = max;
        knob.callback = callback;

        knob.onmousedown = function (e) {
            input.setMouseCapturer(e);
        };

        knob.onmousepressandmove = function (e) {
            var maxY = e.mouseCapturer.parentElement.offsetHeight - e.mouseCapturer.offsetHeight,
                newY = gui.getStyleInt(e.mouseCapturer, "top") + e.movementY;
            
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
            var sliderH = gui.getStyleInt(this.parentElement, "height"),
                knobH = gui.getStyleInt(knob, "height"),
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
        
        track.className = "hslider-track track";
        track.style.height = "100px";
        track.knob = knob;
        track.onmousedown = function (e) {
            this.knob.setValue(this.knob.max - (this.knob.max - this.knob.min) * (e.offsetY / this.offsetHeight));
        };
        
        track.setValue = function (value) {
            this.knob.setValue(value);
        };
        track.getValue = function () {
            return this.knob.value;
        };
        track.appendChild(knob);
        
        knob.setValue(val);
        
        return track;
    },

    makeLabel: function (label) {
        var gLabel = document.createElement("div");
        gLabel.innerText = label;
        gLabel.className = "component-label";
        return gLabel;
    },

    makeButton: function (name, callback, isRadio, buttonCollection) {
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
};