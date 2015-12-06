"use strict";
/*global sDelay*/
/*global gIO*/
/*global gui*/
/*global gWidget*/

function sCDelay(container) {
    var that = gWidget(container, "DELAY"),
        delay = sDelay({"gain": 0.1, "delay": 0.15}),
        outPort = gIO.makeOut(delay),
        inPort = gIO.makeIn(delay);

    that.addLabeledContent(inPort, "in");
    that.addLabeledContent(outPort, "out");
    
    that.addLabeledContent(gui.makeSlider(delay.getArgs().gain, 0.0, 0.99, function (value) {delay.setArgs({"gain": value}); }), "G");
    that.addLabeledContent(gui.makeSlider(delay.getArgs().delay, 0.0, 1.0, function (value) {delay.setArgs({"delay": value}); }), "D");
        
    return that;
}