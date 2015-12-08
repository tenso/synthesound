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

    //FIXME: this should be common stuff to all scComp!
    that.addRemove(function () {
        gIO.delAllConnectionsToAndFromSComp(mix);
    });
    
    that.addLabeledContent(inPort, "in");
    that.addLabeledContent(outPort, "out");
                
    return that;
}