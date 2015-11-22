/*global SConst*/
/*global makeGIO*/
/*global gContainerInit*/
/*global gContainerAddContent*/
/*global gContainerAddLabeledContent*/
/*global gMakeLabel*/
/*global gMakeSlider*/
/*global noteName*/
/*global noteHz*/
/*global GVKey*/

function SCVKey(container) {
    gContainerInit(this, container, "V-KEY");
                    
    var gate = new SConst(),
        hz = new SConst(),
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
    gContainerAddContent(this, currentNote);
    
    gate.value = isDown ? 1.0 : 0.0;
    this.gate = gate;
    this.hz = hz;
            
    gContainerAddLabeledContent(this, gateOut, "G");
    gContainerAddLabeledContent(this, hzOut, "Hz");
        
    vkey.className = "collection vkey";
    gContainerAddContent(this, vkey);
    
    function keyDown(note) {
        noteDown = note;
        isDown = true;
        
        currentNote.innerText = noteName(note);
                
        gate.value = isDown ? 1.0 : 0.0;
        hz.value = noteHz(note);
    }
    function keyUp(note) {
        isDown = false;
        gate.value = isDown ? 1.0 : 0.0;
    }
    
    this.keyboard = new GVKey(vkey, keyDown, keyUp);
}