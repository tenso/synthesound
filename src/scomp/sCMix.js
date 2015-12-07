"use strict";
/*global sAdsr*/
/*global gIO*/
/*global gui*/
/*global gWidget*/

function sCMix(container) {
    var that = gWidget(container, "MIX"),
        mix = sMix(),
        outPort = gIO.makeOut(mix),
        inPort = gIO.makeIn(mix);

    that.addLabeledContent(inPort, "in");
    that.addLabeledContent(outPort, "out");
                
    return that;
}