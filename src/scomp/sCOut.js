"use strict";
/*global sMix*/
/*global sDebug*/
/*global gIO*/
/*global gui*/
/*global gWidget*/
/*global gSlider*/
/*global sCBase*/
/*global audio*/

function sCOut(container, args) {
    var that,
        mix = sMix().setTitle("mainOut"),
        ioport = gIO.makeIn(mix);
        
    that = sCBase(container, mix, args, [ioport], [], true);
    
    function setGain(value) {
        mix.setArgs({"gainL": value, "gainR": value});
    }

    that.addContent(ioport);
    that.nextRow();
    that.addLabeledContent(gSlider(mix.getArgs().gainL, 0.0, 1.0, setGain), "VOL");
    
    that.getOutput = function () {
        return mix;
    };
    
    //FIXME: global coupling!
    audio.mixerOut.addInput(mix);
    
    return that;
}