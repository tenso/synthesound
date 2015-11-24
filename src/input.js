"use strict";

/*global keyUp*/
/*global keyDown*/
/*global setParam*/
/*global getParam*/
/*global startAudio*/
/*global stopAudio*/
/*global GSliders*/
/*global GRadios*/
/*global GVKey*/
/*global Note*/
/*global Float32RB*/
/*global Test*/

/*global connectAllGIO*/
/*global initGIO*/

var keyIsDown = 0;

function mapKeyToNote(e) {
    
}

function parseInputDown(e) {
    var noteMap = {"a": "C", "w": "C#", "s": "D",
                   "e": "D#", "d": "E", "f": "F",
                   "t": "F#", "g": "G", "y": "G#",
                   "h" : "A", "u": "A#", "j": "B"},
        note,
        octave,
        key = String.fromCharCode(e.keyCode);
    
    key = key.toLowerCase();
    
    if (keyIsDown === key) {
        return;
    }
    keyIsDown = key;
    
    octave = 3;
    if (e.shiftKey) {
        octave = 2;
    }
        
    note = noteMap[key] || 1;
    note += octave;
    
    
    note = Note.numFromName(note);
    if (note === -1) {
        return;
    }
    keyDown(note);
}

function parseInputUp(e) {
    var key = String.fromCharCode(e.keyCode);
    key = key.toLowerCase();
    
    if (keyIsDown !== key) {
        return;
    }
    keyIsDown = 0;
    keyUp(0);
}

var mouseCapturer = null;

function setMouseCapturer(e) {
    e.stopPropagation();
    mouseCapturer = e.target;
    
    if (mouseCapturer && mouseCapturer.onmousecaptured) {
        e.mouseCapturer = mouseCapturer;
        mouseCapturer.onmousecaptured(e);
    }
}

window.onload = function () {
    var freqSelect = document.getElementById("freqSelect"),
        playButton = document.getElementById("play"),
        stopButton = document.getElementById("stop"),
        currentNote = document.getElementById("currentNote"),
        shapeSelect = document.getElementById("shapeSelect"),
        oscSelect = document.getElementById("oscSelect"),
        vkey,
        volSliders,
        delSliders,
        adsrSliders;
        
    document.body.onmouseup = function (e) {
        if (mouseCapturer && mouseCapturer.onmouseupaftercapture) {
            e.mouseCapturer = mouseCapturer;
            mouseCapturer.onmouseupaftercapture(e);
        }
        mouseCapturer = null;
    };
    document.body.onmousemove = function (e) {
        if (mouseCapturer && mouseCapturer.onmousepressandmove) {
            e.mouseCapturer = mouseCapturer;
            mouseCapturer.onmousepressandmove(e);
        }
    };
    document.body.onmouseover = function (e) {
        if (mouseCapturer && mouseCapturer.onmouseoveraftercapture) {
            e.mouseCapturer = mouseCapturer;
            mouseCapturer.onmouseoveraftercapture(e);
        }
    };
    
    freqSelect.addEventListener("keydown", parseInputDown, false);
    freqSelect.addEventListener("keyup", parseInputUp, false);
    
    stopButton.addEventListener("click", function () { stopAudio(); }, false);
                
    startAudio();
    
    adsrSliders = new GSliders(document.getElementById("adsrSliders"), "Envelope");
    adsrSliders.add("A", getParam("a"), 0.001, 1.0, function (value) { setParam("a", value); });
    adsrSliders.add("D", getParam("d"), 0.001, 1.0, function (value) { setParam("d", value); });
    adsrSliders.add("S", getParam("s"), 0.0, 1.0, function (value) { setParam("s", value); });
    adsrSliders.add("R", getParam("r"), 0.001, 1.0, function (value) { setParam("r", value); });

    delSliders = new GSliders(document.getElementById("delSliders"), "FB-D");
    delSliders.add("T", getParam("Dt"), 0.0, 0.5, function (value) { setParam("Dt", value); });
    delSliders.add("G", getParam("Dg"), 0.0, 0.9, function (value) { setParam("Dg", value); });

    volSliders = new GSliders(document.getElementById("volSliders"), "VOL");
    volSliders.add("L", getParam("L"), 0.0, 1.0, function (value) { setParam("L", value); });
    volSliders.add("R", getParam("R"), 0.0, 1.0, function (value) { setParam("R", value); });
            
    shapeSelect = new GRadios(document.getElementById("shapeSelect"), "Shape");
    shapeSelect.add("Sine", function (val) {if (val) {setParam("shape", "sine"); } }, true);
    shapeSelect.add("Square", function (val) {if (val) {setParam("shape", "square"); } }, true);
    shapeSelect.set(0);
    
    oscSelect = new GRadios(document.getElementById("oscSelect"), "Oscillators");
    oscSelect.add("Osc 0", function (val) {setParam("osc0", val); }, false);
    oscSelect.add("Osc 1", function (val) {setParam("osc1", val); }, false);
    oscSelect.add("Osc 2", function (val) {setParam("osc2", val); }, false);
    oscSelect.setValue(0, true);
    oscSelect.setValue(1, true);
    oscSelect.setValue(2, true);
    
    connectAllGIO(document.getElementById("lines"));
    
    /*testsuite*/
    Test.runTests();
};
