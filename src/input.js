"use strict";

/*global keyUp*/
/*global keyDown*/
/*global setParam*/
/*global getParam*/
/*global startAudio*/
/*global stopAudio*/
/*global changeType*/
/*global GSliders*/
/*global noteName*/
/*global noteHz*/
/*global noteNumFromName*/
/*global Float32RB*/
/*global runTests*/

var keyIsDown = 0;

function parseInputDown(e) {
    var currentNote = document.getElementById("currentNote"),
        noteMap = {"a": "C", "w": "C#", "s": "D",
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
    
    
    note = noteNumFromName(note);
    if (note === -1) {
        return;
    }
    currentNote.innerText = noteName(note);
    keyDown(noteHz(note));
}

function parseInputUp(e) {
    var key = String.fromCharCode(e.keyCode);
    key = key.toLowerCase();
    
    if (keyIsDown !== key) {
        return;
    }
    keyIsDown = 0;
    keyUp();
}

var lastClientX = 0,
    lastClientY = 0;
var mouseCapturer = null;

function setMouseCapturer(e) {
    lastClientX = e.clientX;
    lastClientY = e.clientY;
    mouseCapturer = e.target;
}

window.onload = function () {
    var freqSelect = document.getElementById("freqSelect"),
        playButton = document.getElementById("play"),
        stopButton = document.getElementById("stop"),
        currentNote = document.getElementById("currentNote"),
        adsrSliders;
            
    document.body.onmouseup = function (e) {
        mouseCapturer = null;
    };
    document.body.onmousemove = function (e) {
        var dx = e.clientX - lastClientX,
            dy = e.clientY - lastClientY;
        
        lastClientX = e.clientX;
        lastClientY = e.clientY;
        
        if (mouseCapturer) {
            mouseCapturer.mouseMove(mouseCapturer, dx, dy);
        }
    };
    
    freqSelect.addEventListener("keydown", parseInputDown, false);
    freqSelect.addEventListener("keyup", parseInputUp, false);
    
    playButton.addEventListener("click", function () { changeType(); }, false);
    stopButton.addEventListener("click", function () { stopAudio(); }, false);
                
    startAudio();
    
    adsrSliders = new GSliders(document.getElementById("adsrSliders"));
    adsrSliders.add("A", getParam("a"), 0.001, 1.0, function (value) { setParam("a", value); });
    adsrSliders.add("D", getParam("d"), 0.001, 1.0, function (value) { setParam("d", value); });
    adsrSliders.add("S", getParam("s"), 0.0, 1.0, function (value) { setParam("s", value); });
    adsrSliders.add("R", getParam("r"), 0.001, 1.0, function (value) { setParam("r", value); });
    
    /*testsuite*/
    runTests();
};
