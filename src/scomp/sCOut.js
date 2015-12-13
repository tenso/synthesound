"use strict";
/*global sMix*/
/*global gSlider*/
/*global sCBase*/
/*global audio*/

function sCOut(container, args) {
    var that,
        mix = sMix();
        
    function setGain(value) {
        mix.setArgs({gainL: value, gainR: value});
    }
        
    that = sCBase(container, "sCOut", {mix: mix}, args, true).addIn("mix");
    that.nextRow();
    that.addLabeledContent(gSlider(mix.getArgs().gainL, 0.0, 1.0, setGain), "VOL");

    //FIXME: global coupling!
    audio.mixerOut.addInput(mix);
    
    return that;
}