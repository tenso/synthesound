"use strict";
/*global sAdsr*/
/*global gIO*/
/*global gui*/

function sCAdsr(container) {
    var that = {},
        adsr = sAdsr({"a": 0.01, "d": 0.15, "s": 0.5, "r": 0.01}),
        outPort = gIO.makeOut(adsr),
        inPort = gIO.makeIn(adsr),
        gatePort = gIO.makeIn(adsr, "gate");

    gui.containerInit(that, container, "ADSR");
    gui.containerAddLabeledContent(that, inPort, "in");
    gui.containerAddLabeledContent(that, outPort, "out");
    gui.containerAddLabeledContent(that, gatePort, "gate");
    
    gui.containerAddLabeledContent(that, gui.makeSlider(adsr.getArgs().a, 0.01, 1.0, function (value) {adsr.setArgs({"a": value}); }), "A");
    gui.containerAddLabeledContent(that, gui.makeSlider(adsr.getArgs().d, 0.01, 1.0, function (value) {adsr.setArgs({"d": value}); }), "D");
    gui.containerAddLabeledContent(that, gui.makeSlider(adsr.getArgs().s, 0.0, 1.0, function (value) {adsr.setArgs({"s": value}); }), "S");
    gui.containerAddLabeledContent(that, gui.makeSlider(adsr.getArgs().r, 0.01, 1.0, function (value) {adsr.setArgs({"r": value}); }), "R");
        
    return that;
}