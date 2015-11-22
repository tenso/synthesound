"use strict";
/*global setMouseCapturer*/

function getPos(element) {
    var x = element.offsetLeft,
        y = element.offsetTop;
    
    while (element.offsetParent) {
        element = element.offsetParent;
        x += element.offsetLeft;
        y += element.offsetTop;
    }
    
    return {"x": x, "y": y};
}

function getSize(elem) {
    var w = elem.offsetWidth,
        h = elem.offsetHeight;

    return {"w": w, "h": h};
}

function getStyle(element, property) {
    return window.getComputedStyle(element, null).getPropertyValue(property);
}

function getStyleInt(element, property) {
    return parseInt(getStyle(element, property), 10);
}

function gTitleRow(title) {
    var titleRow = document.createElement("tr"),
        titleElem = document.createElement("td");
    
    titleElem.innerText = title;
    titleElem.className = "label";
    titleElem.colSpan = 10000;
    titleRow.appendChild(titleElem);
    return titleRow;
}

function gAddToContainer(base, comp) {
    base.table.appendChild(comp);
}

function gContainerAddTitle(base) {
    gAddToContainer(base, gTitleRow(base.title));
}

function gContainerInit(base, container, title) {
    base.container = container;
    base.title = title;
    base.contId = container.id;
    base.table = document.createElement("table");
    base.table.className = "collection-table component";

    base.container.appendChild(base.table);
    
    gContainerAddTitle(base);
    
    base.content = document.createElement("tr");
    base.table.appendChild(base.content);
}

function gContainerAddContent(base, content) {
    var cont = document.createElement("td");
    cont.appendChild(content);
    base.content.appendChild(cont);
}

function gContainerAddLabeledContent(base, content, label) {
    var cont = document.createElement("div"),
        label = gMakeLabel(label);
    
    cont.appendChild(label);
    cont.appendChild(content);
    gContainerAddContent(base, cont);
}

function gMakeSlider(id, val, min, max, callback) {
    var track = document.createElement("div"),
        knob = document.createElement("div");
    
    knob.className = "button-class knob hslider-knob";
    knob.style.position = "relative";
        
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
    
    track.className = "hslider-track track";
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
        
    return track;
}

function gMakeLabel(label) {
    var gLabel = document.createElement("div");
    gLabel.innerText = label;
    gLabel.className = "component-label";
    return gLabel;
}

function gMakeButton(id, callback, isRadio, buttonCollection) {
    var button = document.createElement("div");
    button.siblings = buttonCollection;
    button.siblings.push(button);
    button.isRadio = isRadio;
    
    button.className = "button-class radiobutton-inactive";
    button.innerText = id;
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
        if (isRadio && this.value) {
            this.callback(this.value);
        }
    };
    
    return button;
}