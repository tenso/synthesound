"use strict";
/*global input*/
/*global gui*/
/*global gBase*/

function gSlider(val, min, max, callback) {
    var track = gBase(),
        knob = document.createElement("div");

    knob.className = "button-class gSliderKnob";
    knob.style.position = "relative";
    knob.style.top = "0px";
    knob.style.height = "25px";
    knob.min = min;
    knob.max = max;
    knob.callback = callback;

    knob.onmousedown = function (e) {
        input.setMouseCapturer(e);
    };
    knob.iMousePressAndMove = function (e) {
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

    track.className = "gSliderTrack";
    track.style.height = "100px";
    track.knob = knob;
    track.onmousedown = function (e) {
        this.knob.setValue(this.knob.max - (this.knob.max - this.knob.min) * (e.offsetY / this.offsetHeight));
    };

    track.setValue = function (value) {
        this.knob.setValue(value);
        return this;
    };
    track.getValue = function () {
        return this.knob.value;
    };
    track.appendChild(knob);

    knob.setValue(val);

    return track;
}