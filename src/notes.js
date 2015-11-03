"use strict";
//noteNr 1 = A0 13 = A1 25= A2 etc...
function noteHz(noteNr) {
    return 440 * Math.pow(Math.pow(2, 1 / 12.0), noteNr - 49);
}

function noteName(noteNr) {
    var octave = parseInt((noteNr + 9) / 13, 10),
        names = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
    
    return names[(noteNr - 1) % 12] + octave;
}

function noteNumFromStr(str) {
    var names = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],
        name = str,
        pos = 0,
        octave = 0;
    
    if (typeof (str) !== "string") {
        return -1;
    }
    
    name = name.toUpperCase();
    
    if (str.length !== 3 && str.length !== 2) {
        return -1;
    }
    
    if (str.length === 3) {
        pos = names.indexOf(str.substring(0, 2)) + 1;
        octave = parseInt(str[2], 10);
        if (pos <= 3) {
            octave += 1;
        }
    } else {
        pos = names.indexOf(str.substr(0, 1)) + 1;
        octave = parseInt(str[1], 10);
        if (pos <= 3) {
            octave += 1;
        }
    }
        
    pos += 12 * (octave - 1);
    return pos;
}