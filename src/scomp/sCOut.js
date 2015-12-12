"use strict";
/*global sMix*/
/*global gSlider*/
/*global sCBase*/
/*global audio*/

function sCOut(container, args) {
    var that,
        mix = sMix().setTitle("mainOut");
        
    function setGain(value) {
        mix.setArgs({"gainL": value, "gainR": value});
    }
        
    that = sCBase(container, mix, args, true).addIn();
    that.nextRow();
    that.addLabeledContent(gSlider(mix.getArgs().gainL, 0.0, 1.0, setGain), "VOL");

    //FIXME: global coupling!
    audio.mixerOut.addInput(mix);
    
    return that;
}