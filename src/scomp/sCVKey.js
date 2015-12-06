"use strict";
/*global sConst*/
/*global sStep*/
/*global gIO*/
/*global gui*/
/*global note*/
/*global gVKey*/

function sCVKey(container) {
    var that = {},
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
        
    gui.containerInit(that, container, "V-KEY");
    
    gateOut = gIO.makeOut(gate);
    hzOut = gIO.makeOut(hz);
    
    currentNote.className = "label currentNote";
    currentNote.innerText = "--";
    gui.containerAddContent(that, currentNote);
    
    gate.setArgs({"value": isDown ? 1.0 : 0.0});
            
    gui.containerAddLabeledContent(that, gateOut, "G");
    gui.containerAddLabeledContent(that, hzOut, "Hz");
        
    vkey.className = "collection vkey";
    gui.containerAddContent(that, vkey);
    
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