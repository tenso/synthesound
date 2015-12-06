"use strict";
/*global sConst*/
/*global sStep*/
/*global gIO*/
/*global gui*/
/*global note*/
/*global gVKey*/
/*global gWidget*/

function sCVKey(container) {
    var that = gWidget(container, "V-KEY"),
        gate = sStep(),
        hz = sConst(),
        gateOut,
        hzOut,
        vkey = document.createElement("td"),
        currentNote = document.createElement("td"),
        noteDown = 0,
        isDown = false,
        cont,
        keyboard,
        label;

    gateOut = gIO.makeOut(gate);
    hzOut = gIO.makeOut(hz);
    
    currentNote.className = "label currentNote";
    currentNote.innerText = "--";
    that.addContent(currentNote);
    
    gate.setArgs({"value": isDown ? 1.0 : 0.0});
            
    that.addLabeledContent(gateOut, "G");
    that.addLabeledContent(hzOut, "Hz");
        
    vkey.className = "collection vkey";
    that.addContent(vkey);
    
    that.keyDown = function (notePressed) {
        noteDown = notePressed;
        isDown = true;
        
        currentNote.innerText = note.name(notePressed);
        
        gate.setArgs({"active": isDown});
        hz.setArgs({"value": note.hz(notePressed)});
    };
    
    that.keyUp = function (notePressed) {
        isDown = false;
        gate.setArgs({"active": isDown});
    };
    
    keyboard = gVKey(vkey, that.keyDown, that.keyUp);
    
    return that;
}