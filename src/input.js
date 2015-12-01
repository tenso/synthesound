"use strict";
/*global audio*/
/*global note*/
/*global test*/
/*global gIO*/

var input = {
    keyIsDown: 0,
    mouseCapturer: 0,
    
    parseInputDown: function (e) {
        var noteMap = {"a": "C", "w": "C#", "s": "D",
                       "e": "D#", "d": "E", "f": "F",
                       "t": "F#", "g": "G", "y": "G#",
                       "h" : "A", "u": "A#", "j": "B"},
            cNote,
            octave,
            key = String.fromCharCode(e.keyCode);

        key = key.toLowerCase();

        if (input.keyIsDown === key) {
            return;
        }
        input.keyIsDown = key;

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
        audio.keyDown(cNote);
    },

    parseInputUp: function (e) {
        var key = String.fromCharCode(e.keyCode);
        key = key.toLowerCase();

        if (input.keyIsDown !== key) {
            return;
        }
        input.keyIsDown = 0;
        audio.keyUp(0);
    },
    
    runCallbackIfExist: function (name, e) {
        if (input.mouseCapturer && input.mouseCapturer.hasOwnProperty(name)) {
            e.mouseCapturer = input.mouseCapturer;
            input.mouseCapturer[name](e);
        }
    },
    
    setMouseCapturer: function (e) {
        e.stopPropagation();
        input.mouseCapturer = e.target;
        input.runCallbackIfExist("onmousecaptured", e);
    },

    init: function () {
        document.body.onmouseup = function (e) {
            input.runCallbackIfExist("onmouseupaftercapture", e);
            input.mouseCapturer = undefined;
        };

        document.body.onmousemove = function (e) {
            input.runCallbackIfExist("onmousepressandmove", e);
        };

        document.body.onmouseover = function (e) {
            input.runCallbackIfExist("onmouseoveraftercapture", e);
        };
    }
};