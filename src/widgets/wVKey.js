"use strict";
/*global gui*/
/*global input*/

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
        key.keyDown = keyDown;
        key.keyUp = keyUp;
        key.note = note;
                
        key.onmousedown = function (e) {
            input.setMouseCapturer(e);
        };
        key.onmouseover = function (e) {
            if (isDown) {
                lastNote = key.note;
                key.keyDown(key.note);
            }
        };
        key.iMouseCaptured = function (e) {
            isDown = true;
            lastNote = key.note;
            key.keyDown(key.note);
        };
        key.iMouseUpAfterCapture = function (e) {
            key.keyUp(lastNote);
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
    
    box = document.createElement("div");
    box.className = "vkey-container";
    container.appendChild(box);
    
    for (i = 0; i < keys; i += 1) {
        addKey(box, startKey + i);
    }
    return that;
}