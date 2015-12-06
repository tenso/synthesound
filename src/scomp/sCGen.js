"use strict";
/*global sGen*/
/*global gIO*/
/*global gui*/
/*global gWidget*/
/*global gButton*/

function sCGen(container) {
    var that = gWidget(container, "GEN"),
        typeButtons = [],
        out = sGen({"freq": 110, "amp": 0.25, "type": "sine"}),
        outPort = gIO.makeOut(out),
        freqPort = gIO.makeIn(out, "freq"),
        button;

    that.addLabeledContent(outPort, "out");
    that.addLabeledContent(freqPort, "hz");
    
    button = gButton("sine", function () {out.setArgs({"type": "sine"}); }, true, typeButtons);
    button.setValue(true);
    that.addContent(button);
    
    button = gButton("square", function () {out.setArgs({"type": "square"}); }, true, typeButtons);
    that.addContent(button);
    
    return that;
}