"use strict";

/*global sGen*/
/*global gIO*/
/*global gui*/

function SCGen(container) {
    gui.containerInit(this, container, "GEN");
    
    this.typeButtons = [];
    
    var out = sGen({"freq": 110, "amp": 0.25, "type": "sine"}),
        ioport = gIO.make(out, true, ""),
        freqport = gIO.make(out, false, "freq"),
        button;

    gui.containerAddLabeledContent(this, ioport, "out");
    gui.containerAddLabeledContent(this, freqport, "Hz");
    
    button = gui.makeButton("sine", function () {out.type = "sine"; }, true, this.typeButtons);
    button.setValue(true);
    gui.containerAddContent(this, button);
    
    button = gui.makeButton("square", function () {out.type = "square"; }, true, this.typeButtons);
    gui.containerAddContent(this, button);
}