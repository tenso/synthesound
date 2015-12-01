"use strict";
/*global sGen*/
/*global gIO*/
/*global gui*/

function sCGen(container) {
    var that = {},
        typeButtons = [],
        out = sGen({"freq": 110, "amp": 0.25, "type": "sine"}),
        ioport = gIO.makeOut(out),
        freqport = gIO.makeIn(out, "freq"),
        button;

    gui.containerInit(that, container, "GEN");
    gui.containerAddLabeledContent(that, ioport, "out");
    gui.containerAddLabeledContent(that, freqport, "Hz");
    
    button = gui.makeButton("sine", function () {out.setArgs({"type": "sine"}); }, true, typeButtons);
    button.setValue(true);
    gui.containerAddContent(that, button);
    
    button = gui.makeButton("square", function () {out.setArgs({"type": "square"}); }, true, typeButtons);
    gui.containerAddContent(that, button);
    
    return that;
}