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
/*global note*/
/*global test*/

/*global gIO*/

var keyIsDown = 0;

function mapKeyToNote(e) {
    
}

function parseInputDown(e) {
    var noteMap = {"a": "C", "w": "C#", "s": "D",
                   "e": "D#", "d": "E", "f": "F",
                   "t": "F#", "g": "G", "y": "G#",
                   "h" : "A", "u": "A#", "j": "B"},
        cNote,
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
        
    cNote = noteMap[key] || 1;
    cNote += octave;
    
    
    cNote = note.numFromName(cNote);
    if (cNote === -1) {
        return;
    }
    keyDown(cNote);
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
                
    gIO.connectAll(document.getElementById("lines"));
    
    /*testsuite*/
    test.runTests();
};
