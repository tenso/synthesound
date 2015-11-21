"use strict";

/*global keyUp*/
/*global keyDown*/
/*global setParam*/
/*global getParam*/
/*global startAudio*/
/*global stopAudio*/
/*global changeType*/
/*global GSliders*/
/*global GVKey*/
/*global noteName*/
/*global noteHz*/
/*global noteNumFromName*/
/*global Float32RB*/
/*global runTests*/

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
    
    
    note = noteNumFromName(note);
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
    mouseCapturer = e.target;
}

window.onload = function () {
    var freqSelect = document.getElementById("freqSelect"),
        playButton = document.getElementById("play"),
        stopButton = document.getElementById("stop"),
        currentNote = document.getElementById("currentNote"),
        vkey,
        volSliders,
        delSliders,
        adsrSliders;
            
    currentNote.innerText = "--";
    
    document.body.onmouseup = function (e) {
        if (mouseCapturer && mouseCapturer.onmouseup) {
            mouseCapturer.onmouseup(e);
        }
        mouseCapturer = null;
    };
    document.body.onmousemove = function (e) {
        if (mouseCapturer) {
            if (mouseCapturer.mouseMove) {
                mouseCapturer.mouseMove(mouseCapturer, e.movementX, e.movementY);
            }
        }
    };
    
    freqSelect.addEventListener("keydown", parseInputDown, false);
    freqSelect.addEventListener("keyup", parseInputUp, false);
    
    playButton.addEventListener("click", function () { changeType(); }, false);
    stopButton.addEventListener("click", function () { stopAudio(); }, false);
                
    startAudio();
    
    adsrSliders = new GSliders(document.getElementById("adsrSliders"), "Envelope");
    adsrSliders.add("A", getParam("a"), 0.001, 1.0, function (value) { setParam("a", value); });
    adsrSliders.add("D", getParam("d"), 0.001, 1.0, function (value) { setParam("d", value); });
    adsrSliders.add("S", getParam("s"), 0.0, 1.0, function (value) { setParam("s", value); });
    adsrSliders.add("R", getParam("r"), 0.001, 1.0, function (value) { setParam("r", value); });

    delSliders = new GSliders(document.getElementById("delSliders"), "FB-D");
    delSliders.add("T", getParam("Dt"), 0.0, 0.1, function (value) { setParam("Dt", value); });
    delSliders.add("G", getParam("Dg"), 0.0, 0.9, function (value) { setParam("Dg", value); });

    volSliders = new GSliders(document.getElementById("volSliders"), "VOL");
    volSliders.add("L", getParam("L"), 0.0, 1.0, function (value) { setParam("L", value); });
    volSliders.add("R", getParam("R"), 0.0, 1.0, function (value) { setParam("R", value); });
    
    
    vkey = new GVKey(document.getElementById("vkey"), function(note) {keyDown(note);}, function(note) {keyUp(note);});
    
    /*testsuite*/
    runTests();
};
