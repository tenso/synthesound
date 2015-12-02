"use strict";
/*global sGen*/
/*global gIO*/
/*global gui*/

function sCGen(container) {
    var that = {},
        typeButtons = [],
        out = sGen({"freq": 110, "amp": 0.25, "type": "sine"}),
        outPort = gIO.makeOut(out),
        freqPort = gIO.makeIn(out, "freq"),
        button;

    gui.containerInit(that, container, "GEN");
    gui.containerAddLabeledContent(that, outPort, "out");
    gui.containerAddLabeledContent(that, freqPort, "hz");
    
    button = gui.makeButton("sine", function () {out.setArgs({"type": "sine"}); }, true, typeButtons);
    button.setValue(true);
    gui.containerAddContent(that, button);
    
    button = gui.makeButton("square", function () {out.setArgs({"type": "square"}); }, true, typeButtons);
    gui.containerAddContent(that, button);
    
    return that;
}