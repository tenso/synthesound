"use strict";
/*global sAdsr*/
/*global gIO*/
/*global gui*/
/*global sMix*/
/*global sCBase*/

function sCMix(container, args) {
    var that,
        mix = sMix(),
        outPort = gIO.makeOut(mix),
        inPort = gIO.makeIn(mix);
    
    that = sCBase(container, mix, args, [inPort, outPort]);
    
    that.addLabeledContent(inPort, "in");
    that.addLabeledContent(outPort, "out");
                
    return that;
}