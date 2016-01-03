"use strict";
/*global test*/
/*global mUtil*/

var note = {
    noteBase: Math.pow(2, 1 / 12.0),
    //noteNr 1 = A0 13 = A1 25= A2 etc...
    hz: function (noteNr) {
        return 440 * Math.pow(note.noteBase, noteNr - 49);
    },

    note: function (hz) {
        if (hz <= 0) {
            return -1;
        }
        return Math.round(49 + mUtil.log(hz / 440.0, note.noteBase));
    },

    name: function (noteNr) {
        if (noteNr < 1) {
            return "-";
        }
        var octave = parseInt((noteNr + 9) / 13, 10),
            names = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

        return names[(noteNr - 1) % 12] + octave;
    },

    noteFromName: function (str) {
        var names = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],
            name = str,
            pos = 0,
            octave = 0;

        if (typeof str !== "string") {
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
    },

    tests: {
        test_hz: function () {
            test.verifyFloat(note.hz(-1), 24.5, 3);
            test.verifyFloat(note.hz(0), 25.957, 3);
            test.verifyFloat(note.hz(1), 27.500, 3);
            test.verifyFloat(note.hz(2), 29.135, 3);
            test.verifyFloat(note.hz(27), 123.471, 3);
            test.verifyFloat(note.hz(43), 311.127, 3);
            test.verifyFloat(note.hz(49), 440.0, 3);
            test.verifyFloat(note.hz(69), 1396.91, 2);
        },

        test_name: function () {
            test.verify(note.name(-1), "-");
            test.verify(note.name(0), "-");
            test.verify(note.name(1), "A0");
            test.verify(note.name(2), "A#0");
            test.verify(note.name(16), "C1");
            test.verify(note.name(27), "B2");
            test.verify(note.name(43), "D#4");
            test.verify(note.name(69), "F6");
        },

        test_noteFromName: function () {
            test.verify(note.noteFromName("notFound"), -1);
            test.verify(note.noteFromName("A0"), 1);
            test.verify(note.noteFromName("A#0"), 2);
            test.verify(note.noteFromName("B2"), 27);
            test.verify(note.noteFromName("C3"), 28);
            test.verify(note.noteFromName("C#3"), 29);
            test.verify(note.noteFromName("D3"), 30);
            test.verify(note.noteFromName("D#4"), 43);
            test.verify(note.noteFromName("F6"), 69);
        },

        test_note: function () {
            test.verify(note.note(-1), -1);
            test.verify(note.note(0), -1);
            test.verify(note.note(27.5), 1);
            test.verify(note.note(440), 49);
            test.verify(note.note(123.471), 27);
            test.verify(note.note(130.813), 28);
            test.verify(note.note(138.591), 29);
            test.verify(note.note(146.832), 30);

        }
    }
};

test.addTests(note, "note");
