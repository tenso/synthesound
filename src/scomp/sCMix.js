"use strict";
/*global sAdsr*/
/*global gIO*/
/*global gui*/

function sCMix(container) {
    var that = {},
        mix = sMix(),
        outPort = gIO.makeOut(mix),
        inPort = gIO.makeIn(mix);

    gui.containerInit(that, container, "MIX");
    gui.containerAddLabeledContent(that, outPort, "out");
    gui.containerAddLabeledContent(that, inPort, "in");
                
    return that;
}