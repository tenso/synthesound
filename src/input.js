"use strict";
/*global audio*/
/*global note*/
/*global test*/
/*global gIO*/
/*global log*/

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
    
    runCaptureCBIfExist: function (name, e) {
        if (input.mouseCapturer && input.mouseCapturer.hasOwnProperty(name)) {
            e.mouseCapturer = input.mouseCapturer;
            input.mouseCapturer[name](e);
        }
    },
    runCBIfExist: function (name, e) {
        if (e.target.hasOwnProperty(name)) {
            e.target[name](e);
        }
    },
    
    setMouseCapturer: function (e) {
        e.stopPropagation();
        input.mouseCapturer = e.target;
        input.runCaptureCBIfExist("onmousecaptured", e);
    },

    init: function () {
        document.addEventListener("mouseup", function (e) {
            input.runCaptureCBIfExist("onmouseupaftercapture", e);
            input.mouseCapturer = undefined;
        });

        document.addEventListener("mousemove", function (e) {
            input.runCaptureCBIfExist("onmousepressandmove", e);
        });

        document.addEventListener("mouseover", function (e) {
            input.runCaptureCBIfExist("onmouseoveraftercapture", e);
        });
        
        document.addEventListener("contextmenu", function (e) {
            input.runCBIfExist("onopencontextmenu", e);
            e.preventDefault();
        });
    }
};