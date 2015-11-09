"use strict";

/*global keyUp */
/*global keyDown */
/*global startAudio */
/*global stopAudio */
/*global noteName */
/*global noteHz */
/*global noteNumFromStr */

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
    
    
    note = noteNumFromStr(note);
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
        currentNote = document.getElementById("currentNote");
    
    freqSelect.addEventListener("keydown", parseInputDown, false);
    freqSelect.addEventListener("keyup", parseInputUp, false);
    
    playButton.addEventListener("click", function () { startAudio(); }, false);
    stopButton.addEventListener("click", function () { stopAudio(); }, false);
};