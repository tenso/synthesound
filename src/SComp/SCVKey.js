/*global SConst*/
/*global makeGIO*/
/*global gContainerInit*/
/*global gContainerAddContent*/
/*global gMakeLabel*/
/*global gMakeSlider*/
/*global noteName*/
/*global noteHz*/
/*global GVKey*/

function SCVKey(container) {
    gContainerInit(this, container, "V-KEY");
                    
    var gate = new SConst(),
        hz = new SConst(),
        gateOut = makeGIO(gate, true, "gate"),
        hzOut = makeGIO(hz, true, "hz"),
        vkey = document.createElement("td"),
        currentNote = document.createElement("td"),
        noteDown = 0,
        isDown = false,
        cont,
        label;
        
    currentNote.className = "label currentNote";
    currentNote.innerText = "--";
    gContainerAddContent(this, currentNote);
    
    gate.value = isDown ? 1.0 : 0.0;
    this.gate = gate;
    this.hz = hz;
            
    cont = document.createElement("div");
    label = gMakeLabel("G");
    cont.appendChild(label);
    cont.appendChild(gateOut);
    gContainerAddContent(this, cont);
    
    cont = document.createElement("div");
    label = gMakeLabel("Hz");
    cont.appendChild(label);
    cont.appendChild(hzOut);
    gContainerAddContent(this, cont);
        
    vkey.className = "collection vkey";
    gContainerAddContent(this, vkey);
    
    function keyDown(note) {
        noteDown = note;
        isDown = true;
        
        currentNote.innerText = noteName(note);
                
        gate.value = isDown ? 1.0 : 0.0;
        hz.value = noteHz(note);
        
        console.log("key down:" + gate.value);
    }
    function keyUp(note) {
        isDown = false;
        gate.value = isDown ? 1.0 : 0.0;
        console.log("key up:" + gate.value);
    }
    
    this.keyboard = new GVKey(vkey, keyDown, keyUp);
}