"use strict";
/*global sDelay*/
/*global gIO*/
/*global gui*/
/*global sCBase*/
/*global gSlider*/

function sCDelay(container, args) {
    var that,
        delay = sDelay({"gain": 0.1, "delay": 0.15}),
        outPort = gIO.makeOut(delay),
        inPort = gIO.makeIn(delay);

    that = sCBase(container, delay, args);
        
    that.addLabeledContent(inPort, "in");
    that.addLabeledContent(outPort, "out");
    that.nextRow();
    that.addLabeledContent(gSlider(delay.getArgs().gain, 0.0, 0.99, function (value) {delay.setArgs({"gain": value}); }), "G");
    that.addLabeledContent(gSlider(delay.getArgs().delay, 0.0, 1.0, function (value) {delay.setArgs({"delay": value}); }), "D");
        
    return that;
}