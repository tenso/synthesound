"use strict";
/*global Test*/

var Note = {
    //noteNr 1 = A0 13 = A1 25= A2 etc...
    hz: function (noteNr) {
        return 440 * Math.pow(Math.pow(2, 1 / 12.0), noteNr - 49);
    },

    name: function (noteNr) {
        var octave = parseInt((noteNr + 9) / 13, 10),
            names = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

        return names[(noteNr - 1) % 12] + octave;
    },

    numFromName: function (str) {
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
    },

    tests: {
        test_hz: function () {
            Test.verifyFloat(Note.hz(1), 27.500, 3);
            Test.verifyFloat(Note.hz(2), 29.135, 3);
            Test.verifyFloat(Note.hz(27), 123.471, 3);
            Test.verifyFloat(Note.hz(43), 311.127, 3);
            Test.verifyFloat(Note.hz(69), 1396.91, 2);
        },
        
        test_name: function () {
            Test.verify(Note.name(1), "A0");
            Test.verify(Note.name(2), "A#0");
            Test.verify(Note.name(27), "B2");
            Test.verify(Note.name(43), "D#4");
            Test.verify(Note.name(69), "F6");
        },

        test_numFromName: function () {
            Test.verify(Note.numFromName("A0"), 1);
            Test.verify(Note.numFromName("A#0"), 2);
            Test.verify(Note.numFromName("B2"), 27);
            Test.verify(Note.numFromName("D#4"), 43);
            Test.verify(Note.numFromName("F6"), 69);
        }
    }
};

Test.addTests(Note, "Note");
