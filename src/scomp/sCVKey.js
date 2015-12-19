"use strict";
/*global sConst*/
/*global sStep*/
/*global gui*/
/*global note*/
/*global wVKey*/
/*global sCBase*/
/*global gLabel*/
/*global audio*/

function sCVKey(container, args) {
    var that,
        gate = sStep(),
        hz = sConst(),
        gateOut,
        hzOut,
        vkey = document.createElement("td"),
        currentNote = gLabel("--").abs().move(12, 50).setSize(40, 20).bg("#888").color("#fff").radius(4),
        noteDown = 0,
        isDown = false,
        cont,
        keyboard,
        label;

    that = sCBase(container, "sCVKey", {gate: gate, freq: hz}, args).addOut("gate").addOut("freq");
    
    that.addContent(currentNote);
    
    gate.setArgs({value: isDown ? 1.0 : 0.0});
            
    vkey.className = "collection vkey";
    that.addContent(vkey);
    
    that.keyDown = function (notePressed) {
        noteDown = notePressed;
        isDown = true;
        
        currentNote.set(note.name(notePressed));
        
        gate.setArgs({active: isDown});
        hz.setArgs({value: note.hz(notePressed)});
    };
    
    that.keyUp = function (notePressed) {
        isDown = false;
        gate.setArgs({active: isDown});
    };
    
    keyboard = wVKey(vkey, that.keyDown, that.keyUp);
    
    //FIXME: global coupling
    audio.key = that;
    
    return that;
}