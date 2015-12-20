"use strict";
/*global note*/
/*global test*/
/*global gIO*/
/*global log*/
/*global gui*/

var input = {
    keyIsDown: 0,
    mouseCapturer: 0,
    mouse: {},
    container: undefined,
    
    parseInputDown: function (e) {
        var noteMap = {a: "C",  w: "C#", s: "D",
                       e: "D#", d: "E",  f: "F",
                       t: "F#", g: "G",  y: "G#",
                       h: "A",  u: "A#", j: "B"},
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


        cNote = note.noteFromName(cNote);
        if (cNote === -1) {
            return;
        }
        
        input.container.keyDown(cNote);
    },

    parseInputUp: function (e) {
        var key = String.fromCharCode(e.keyCode);
        key = key.toLowerCase();

        if (input.keyIsDown !== key) {
            return;
        }
        input.keyIsDown = 0;
        input.container.keyUp(0);
    },
    
    runCaptureCBIfExist: function (name, e) {
        input.setMouseFromEvent(e);

        if (input.mouseCapturer && input.mouseCapturer.hasOwnProperty(name)) {
            e.mouseCapturer = input.mouseCapturer;
            input.mouseCapturer[name](e, input.mouse);
        }
    },
    runCBIfExist: function (name, e) {
        input.setMouseFromEvent(e);
        
        if (e.target.hasOwnProperty(name)) {
            e.target[name](e, input.mouse);
        }
    },
    
    setMouseFromEvent: function (e) {
        input.mouse.x = e.pageX + input.container.scrollLeft;
        input.mouse.y = e.pageY + input.container.scrollTop;
        input.mouse.relativeX = input.mouse.x - input.mouse.captureOffsetInElement.x;
        input.mouse.relativeY = input.mouse.y - input.mouse.captureOffsetInElement.y;
    },
    
    setMouseCaptureFromEvent: function (e, target) {
        input.mouse.captureOffsetInElement = gui.getEventOffsetInElement(target, e);
        input.mouse.captureOffsetInElement.x += input.container.scrollLeft;
        input.mouse.captureOffsetInElement.y += input.container.scrollTop;
        input.mouse.captureX = e.pageX + input.container.scrollLeft;
        input.mouse.captureY = e.pageY + input.container.scrollTop;
    },
    
    setMouseCapturer: function (e, wantedObject) {
    
        e.stopPropagation();
        if (!wantedObject) {
            input.mouseCapturer = e.target;
        } else {
            input.mouseCapturer = wantedObject;
        }
        input.setMouseCaptureFromEvent(e, input.mouseCapturer);
        input.runCaptureCBIfExist("iMouseCaptured", e);
    },
    
    sizeOfContainerChanged: undefined,
    oldSize: {w: 0, h: 0},
    
    checkSize: function (container) {
        var newSize = {w: container.scrollWidth, h: container.scrollHeight};
        
        if (newSize.w !== input.oldSize.w
                || newSize.h !== input.oldSize.h) {
            input.oldSize = newSize;
            if (input.sizeOfContainerChanged) {
                input.sizeOfContainerChanged(newSize);
            }
        }
    },
    
    init: function (container, sizeOfContainerChanged) {
        input.container = container;
        input.sizeOfContainerChanged = sizeOfContainerChanged;
    
        /*document.addEventListener("mousedown", function (e) {
            input.setMouseCapturer(e);
        });*/
        
        document.addEventListener("mouseup", function (e) {
            if (input.mouseCapturer) {
                input.runCaptureCBIfExist("iMouseUpAfterCapture", e);
                input.mouseCapturer = undefined;
            }
        });

        document.addEventListener("mousemove", function (e) {
            if (input.mouseCapturer) {

                input.runCaptureCBIfExist("iMousePressAndMove", e);
                
                input.checkSize(container);
            }
        });

        document.addEventListener("mouseover", function (e) {
            if (input.mouseCapturer) {
                input.runCaptureCBIfExist("iMouseOverAfterCapture", e);
            }
        });
        
        document.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            //NOTE: dont set  captured here: will send all sorts of events...
            input.setMouseCaptureFromEvent(e, e.target);
            input.runCBIfExist("iOpenContextMenu", e);
            
        });
    }
};