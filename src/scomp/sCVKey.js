"use strict";
/*global sConst*/
/*global sStep*/
/*global gIO*/
/*global gui*/
/*global note*/
/*global gVKey*/
/*global gWidget*/
/*global gLabel*/

function sCVKey(container) {
    var that = gWidget(container, "keyboard (fixme)"),
        gate = sStep(),
        hz = sConst(),
        gateOut,
        hzOut,
        vkey = document.createElement("td"),
        currentNote = gLabel("--").abs().move(12, 50).size(40, 20).bg("#888").color("#fff").radius(4),
        noteDown = 0,
        isDown = false,
        cont,
        keyboard,
        label;

    gateOut = gIO.makeOut(gate);
    hzOut = gIO.makeOut(hz);

    that.addContent(currentNote);
    
    gate.setArgs({"value": isDown ? 1.0 : 0.0});
            
    that.addLabeledContent(gateOut, "G");
    that.addLabeledContent(hzOut, "Hz");
        
    vkey.className = "collection vkey";
    that.addContent(vkey);
    
    that.keyDown = function (notePressed) {
        noteDown = notePressed;
        isDown = true;
        
        currentNote.set(note.name(notePressed));
        
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