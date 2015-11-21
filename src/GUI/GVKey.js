"use strict";

/*global getStyleInt*/
/*global setMouseCapturer*/

function GVKey(container, keyDown, keyUp) {
    var i = 0,
        box;
    
    this.keys = 48;
    this.startKey = 16;
    this.container = container;
    this.nextX = 0;
    this.keyDown = keyDown;
    this.keyUp = keyUp;
    this.isDown = false;
    this.lastNote = -1;
    
    this.addKey = function (container, note) {
        var key = document.createElement("div"),
            flat = true,
            keyX = 0;
        
        key.id = "vkeyb-note-" + note;
        key.keyDown = this.keyDown;
        key.keyUp = this.keyUp;
        key.note = note;
        key.parent = this;
        
        key.onmousedown = function (e) {
            setMouseCapturer(e);
         };
        key.onmouseover = function (e) {
            if (key.parent.isDown) {
                key.parent.lastNote = key.note;
                key.keyDown(key.note);
            }
        };
        key.onmousecaptured = function (e) {
            key.parent.isDown = true;
            key.parent.lastNote = key.note;
            key.keyDown(key.note);
        }
        key.onmouseupaftercapture = function (e) {
            key.keyUp(key.parent.lastNote);
            key.parent.isDown = false;
        };
        
        container.appendChild(key);
        
        if (note % 12 === 2 || note % 12 === 5 || note % 12 === 7
                || note % 12 === 10 || note % 12 === 12) {
            flat = false;
        }
        
        if (flat) {
            key.className = "vkey-key-flat";
        } else {
            key.className = "vkey-key-sharp";
        }
        keyX = this.nextX;
        
        if (flat) {
            this.nextX += getStyleInt(key, "width");
        } else {
            keyX -= getStyleInt(key, "width") / 2;
        }
        
        key.style.left = keyX + "px";
        key.style.top = 0 + "px";
        return key;
    };
    
    box = document.createElement("div");
    box.className = "vkey-container";
    this.container.appendChild(box);
    
    for (i = 0; i < this.keys; i += 1) {
        this.addKey(box, this.startKey + i);
    }
    
}