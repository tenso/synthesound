"use strict";

/*global getGenFreq */
/*global setGenFreq */
/*global startAudio */
/*global stopAudio */
/*global noteName */
/*global noteHz */
/*global noteNumFromStr */

function parseInput(e) {
    var currentNote = document.getElementById("currentNote"),
        noteMap = {"a": "C", "w": "C#", "s": "D",
                   "e": "D#", "d": "E", "f": "F",
                   "t": "F#", "g": "G", "y": "G#",
                   "h" : "A", "u": "A#", "j": "B"},
        note,
        octave,
        key = String.fromCharCode(e.keyCode);
    
    key = key.toLowerCase();
        
    octave = 4;
    if (e.shiftKey) {
        octave = 3;
    }
        
    
    note = noteMap[key] || 1;
    note += octave;
    note = noteNumFromStr(note);
    if (note === -1) {
        return;
    }
    currentNote.innerText = noteName(note);
    setGenFreq(noteHz(note));
}

window.onload = function () {
    var freqSelect = document.getElementById("freqSelect"),
        playButton = document.getElementById("play"),
        stopButton = document.getElementById("stop"),
        currentNote = document.getElementById("currentNote");
    
    freqSelect.defaultValue = 110;
    freqSelect.onchange = parseInput;
    freqSelect.addEventListener("keydown", parseInput, false);
    playButton.addEventListener("click", function () { startAudio(); }, false);
    stopButton.addEventListener("click", function () { stopAudio(); }, false);
};