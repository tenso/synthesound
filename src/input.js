"use strict";

/*global keyUp*/
/*global keyDown*/
/*global setParam*/
/*global getParam*/
/*global startAudio*/
/*global stopAudio*/
/*global changeType*/
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

window.onload = function () {
    var freqSelect = document.getElementById("freqSelect"),
        playButton = document.getElementById("play"),
        stopButton = document.getElementById("stop"),
        currentNote = document.getElementById("currentNote"),
        aSlider = document.getElementById("aSlider"),
        dSlider = document.getElementById("dSlider"),
        sSlider = document.getElementById("sSlider"),
        rSlider = document.getElementById("rSlider");
    
    freqSelect.addEventListener("keydown", parseInputDown, false);
    freqSelect.addEventListener("keyup", parseInputUp, false);
    
    playButton.addEventListener("click", function () { changeType(); }, false);
    stopButton.addEventListener("click", function () { stopAudio(); }, false);
    
    aSlider.addEventListener("input", function (e) { setParam("a", e.target.value); });
    dSlider.addEventListener("input", function (e) { setParam("d", e.target.value); });
    sSlider.addEventListener("input", function (e) { setParam("s", e.target.value); });
    rSlider.addEventListener("input", function (e) { setParam("r", e.target.value); });
            
    startAudio();

    aSlider.value = getParam("a");
    dSlider.value = getParam("d");
    sSlider.value = getParam("s");
    rSlider.value = getParam("r");
    
    /*testsuite*/
    runTests();
};