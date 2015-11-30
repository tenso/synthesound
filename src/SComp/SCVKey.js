"use strict";

/*global sConst*/
/*global gIO*/
/*global gui*/
/*global note*/
/*global GVKey*/

function SCVKey(container) {
    gui.containerInit(this, container, "V-KEY");
                    
    var gate = sConst(),
        hz = sConst(),
        gateOut,
        hzOut,
        vkey = document.createElement("td"),
        currentNote = document.createElement("td"),
        noteDown = 0,
        isDown = false,
        cont,
        label;
        
    gateOut = gIO.make(gate, true, "");
    hzOut = gIO.make(hz, true, "");
    
    currentNote.className = "label currentNote";
    currentNote.innerText = "--";
    gui.containerAddContent(this, currentNote);
    
    gate.value = isDown ? 1.0 : 0.0;
    this.gate = gate;
    this.hz = hz;
            
    gui.containerAddLabeledContent(this, gateOut, "G");
    gui.containerAddLabeledContent(this, hzOut, "Hz");
        
    vkey.className = "collection vkey";
    gui.containerAddContent(this, vkey);
    
    function keyDown(notePressed) {
        noteDown = notePressed;
        isDown = true;
        
        currentNote.innerText = note.name(notePressed);
                
        gate.value = isDown ? 1.0 : 0.0;
        hz.value = note.hz(notePressed);
    }
    function keyUp(notePressed) {
        isDown = false;
        gate.value = isDown ? 1.0 : 0.0;
    }
    
    this.keyboard = new GVKey(vkey, keyDown, keyUp);
}