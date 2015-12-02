"use strict";
/*global sDelay*/
/*global gIO*/
/*global gui*/

function sCDelay(container) {
    var that = {},
        delay = sDelay({"gain": 0.1, "delay": 0.15}),
        outPort = gIO.makeOut(delay),
        inPort = gIO.makeIn(delay);

    gui.containerInit(that, container, "DELAY");
    gui.containerAddLabeledContent(that, inPort, "in");
    gui.containerAddLabeledContent(that, outPort, "out");
    
    gui.containerAddLabeledContent(that, gui.makeSlider(delay.getArgs().gain, 0.0, 0.99, function (value) {delay.setArgs({"gain": value}); }), "G");
    gui.containerAddLabeledContent(that, gui.makeSlider(delay.getArgs().delay, 0.0, 1.0, function (value) {delay.setArgs({"delay": value}); }), "D");
        
    return that;
}