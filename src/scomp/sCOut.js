"use strict";
/*global sMix*/
/*global sDebug*/
/*global gIO*/
/*global gui*/

function sCOut(container) {
    var that = {},
        mix = sMix(),
        ioport = gIO.makeIn(mix);
        
    function setGain(value) {
        mix.setChannelGain(0, value);
        mix.setChannelGain(1, value);
    }

    gui.containerInit(that, container, "Output");
    gui.containerAddContent(that, ioport);
    gui.containerAddLabeledContent(that, gui.makeSlider(0.5, 0.0, 1.0, setGain), "VOL");
    
    that.getOutput = function() {
        return mix;
    }
    
    return that;
}