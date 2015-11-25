"use strict";

/*global sConst*/
/*global makeGIO*/
/*global GUI*/
/*global Note*/
/*global GVKey*/

function SCVKey(container) {
    GUI.containerInit(this, container, "V-KEY");
                    
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
        
    gateOut = makeGIO(gate, true, "");
    hzOut = makeGIO(hz, true, "");
    
    currentNote.className = "label currentNote";
    currentNote.innerText = "--";
    GUI.containerAddContent(this, currentNote);
    
    gate.value = isDown ? 1.0 : 0.0;
    this.gate = gate;
    this.hz = hz;
            
    GUI.containerAddLabeledContent(this, gateOut, "G");
    GUI.containerAddLabeledContent(this, hzOut, "Hz");
        
    vkey.className = "collection vkey";
    GUI.containerAddContent(this, vkey);
    
    function keyDown(note) {
        noteDown = note;
        isDown = true;
        
        currentNote.innerText = Note.name(note);
                
        gate.value = isDown ? 1.0 : 0.0;
        hz.value = Note.hz(note);
    }
    function keyUp(note) {
        isDown = false;
        gate.value = isDown ? 1.0 : 0.0;
    }
    
    this.keyboard = new GVKey(vkey, keyDown, keyUp);
}