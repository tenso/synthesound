"use strict";
/*global sAdsr*/
/*global gIO*/
/*global gui*/
/*global gWidget*/
/*global gSlider*/

function sCAdsr(container) {
    var that = gWidget(container, "ADSR"),
        adsr = sAdsr({"a": 0.01, "d": 0.15, "s": 0.5, "r": 0.01}),
        outPort = gIO.makeOut(adsr),
        inPort = gIO.makeIn(adsr),
        gatePort = gIO.makeIn(adsr, "gate");

    that.addLabeledContent(inPort, "in");
    that.addLabeledContent(gatePort, "gate");
    that.addLabeledContent(outPort, "out");
    that.nextRow();
    that.addLabeledContent(gSlider(adsr.getArgs().a, 0.01, 1.0, function (value) {adsr.setArgs({"a": value}); }), "A");
    that.addLabeledContent(gSlider(adsr.getArgs().d, 0.01, 1.0, function (value) {adsr.setArgs({"d": value}); }), "D");
    that.addLabeledContent(gSlider(adsr.getArgs().s, 0.0, 1.0, function (value) {adsr.setArgs({"s": value}); }), "S");
    that.addLabeledContent(gSlider(adsr.getArgs().r, 0.01, 1.0, function (value) {adsr.setArgs({"r": value}); }), "R");
        
    return that;
}