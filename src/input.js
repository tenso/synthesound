"use strict";
/*global audio*/
/*global note*/
/*global test*/
/*global gIO*/
/*global log*/
/*global gui*/

var input = {
    keyIsDown: 0,
    mouseCapturer: 0,
    captureOffsetInElement: {},
    
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
        var relativePos = {};
        
        if (input.mouseCapturer && input.mouseCapturer.hasOwnProperty(name)) {
            e.mouseCapturer = input.mouseCapturer;
            relativePos.x = e.clientX - input.captureOffsetInElement.x;
            relativePos.y = e.clientY - input.captureOffsetInElement.y;
            input.mouseCapturer[name](e, relativePos);
        }
    },
    runCBIfExist: function (name, e) {
        if (e.target.hasOwnProperty(name)) {
            e.target[name](e);
        }
    },
    
    setMouseCapturer: function (e, wantedObject) {
        e.stopPropagation();
        if (!wantedObject) {
            input.mouseCapturer = e.target;
        } else {
            input.mouseCapturer = wantedObject;
        }
        input.captureOffsetInElement = gui.getEventOffsetInElement(input.mouseCapturer, e);
        input.runCaptureCBIfExist("onmousecaptured", e);
    },

    init: function () {
        document.addEventListener("mouseup", function (e) {
            if (input.mouseCapturer) {
                input.runCaptureCBIfExist("onmouseupaftercapture", e);
                input.mouseCapturer = undefined;
            }
        });

        document.addEventListener("mousemove", function (e) {
            if (input.mouseCapturer) {
                input.runCaptureCBIfExist("onmousepressandmove", e);
            }
        });

        document.addEventListener("mouseover", function (e) {
            if (input.mouseCapturer) {
                input.runCaptureCBIfExist("onmouseoveraftercapture", e);
            }
        });
        
        document.addEventListener("contextmenu", function (e) {
            input.runCBIfExist("onopencontextmenu", e);
            e.preventDefault();
        });
    }
};