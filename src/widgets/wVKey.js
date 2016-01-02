"use strict";
/*global gui*/
/*global note*/

function wVKey(container, keyDown, keyUp) {
    var that = {},
        i = 0,
        box,
        keys = 60,
        startKey = 16,
        nextX = 0,
        isDown = false,
        lastNote = -1;
    
    function addKey(container, note) {
        var key = document.createElement("div"),
            flat = true,
            keyX = 0;
        
        key.id = "vkeyb-note-" + note;
        key.note = note;
                
        key.onmousedown = function (e) {
            gui.captureMouse(e);
        };
        key.onmouseover = function (e) {
            if (isDown) {
                lastNote = key.note;
                keyDown(key.note);
            }
        };
        key.iMouseCaptured = function (e) {
            isDown = true;
            lastNote = key.note;
            keyDown(key.note);
        };
        key.iMouseUpAfterCapture = function (e) {
            keyUp();
            isDown = false;
        };
        
        container.appendChild(key);
        
        if (note % 12 === 2 || note % 12 === 5 || note % 12 === 7
                || note % 12 === 10 || note % 12 === 0) {
            flat = false;
        }
        
        if (flat) {
            key.className = "vkey-key-flat";
        } else {
            key.className = "vkey-key-sharp";
        }
        keyX = nextX;
        
        if (flat) {
            nextX += gui.getStyleInt(key, "width");
        } else {
            keyX -= gui.getStyleInt(key, "width") / 2;
        }
        
        key.style.left = keyX + "px";
        key.style.top = "0px";
        
        return key;
    }
    
    that.iKeyDown = function (key, shift) {
        var noteMap = {a: "C",  w: "C#", s: "D",
                       e: "D#", d: "E",  f: "F",
                       t: "F#", g: "G",  y: "G#",
                       h: "A",  u: "A#", j: "B"},
            cNote,
            octave = shift ? 2 : 3;
        
        cNote = noteMap[key] || 1;
        cNote += octave;
        cNote = note.noteFromName(cNote);
        if (cNote === -1) {
            return;
        }
        keyDown(cNote);
    };

    that.iKeyUp = function (key, shift) {
        keyUp();
    };
    
    box = document.createElement("div");
    box.className = "vkey-container";
    container.appendChild(box);
    
    for (i = 0; i < keys; i += 1) {
        addKey(box, startKey + i);
    }
    that.typeIs = "wVKey";
    return that;
}