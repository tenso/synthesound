"use strict";
/*global verify*/
/*global verifyFloat*/
/*global addTest*/

//noteNr 1 = A0 13 = A1 25= A2 etc...
function noteHz(noteNr) {
    return 440 * Math.pow(Math.pow(2, 1 / 12.0), noteNr - 49);
}

function test_noteHz() {
    verifyFloat(noteHz(1), 27.500, 3);
    verifyFloat(noteHz(2), 29.135, 3);
    verifyFloat(noteHz(27), 123.471, 3);
    verifyFloat(noteHz(43), 311.127, 3);
    verifyFloat(noteHz(69), 1396.91, 2);
}
addTest(test_noteHz, "noteHz()");

function noteName(noteNr) {
    var octave = parseInt((noteNr + 9) / 13, 10),
        names = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
    
    return names[(noteNr - 1) % 12] + octave;
}

function test_noteName() {
    verify(noteName(1), "A0");
    verify(noteName(2), "A#0");
    verify(noteName(27), "B2");
    verify(noteName(43), "D#4");
    verify(noteName(69), "F6");
}
addTest(test_noteName, "noteName()");

function noteNumFromName(str) {
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

function test_noteNumFromName() {
    verify(noteNumFromName("A0"), 1);
    verify(noteNumFromName("A#0"), 2);
    verify(noteNumFromName("B2"), 27);
    verify(noteNumFromName("D#4"), 43);
    verify(noteNumFromName("F6"), 69);
}
addTest(test_noteNumFromName, "noteNumFromName()");