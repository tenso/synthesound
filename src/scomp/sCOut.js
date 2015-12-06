"use strict";
/*global sMix*/
/*global sDebug*/
/*global gIO*/
/*global gui*/
/*global gWidget*/
/*global gSlider*/

function sCOut(container) {
    var that = gWidget(container, "OUT"),
        mix = sMix(),
        ioport = gIO.makeIn(mix);
        
    function setGain(value) {
        mix.setArgs({"gainL": value, "gainR": value});
    }

    that.addContent(ioport);
    that.nextRow();
    that.addLabeledContent(gSlider(0.5, 0.0, 1.0, setGain), "VOL");
    
    that.getOutput = function () {
        return mix;
    };
    
    return that;
}