"use strict";
/*global sMix*/
/*global gSlider*/
/*global sCBase*/
/*global audioWork*/

function sCOut(container, uid) {
    var mix = sMix(),
        that = sCBase(container, "sCOut", {mix: mix}, uid),
        controls = {mix: {}};
        
    function setGainL(value) {
        mix.setArgs({gainL: value});
    }
    
    function setGainR(value) {
        mix.setArgs({gainR: value});
    }
        
    that.addIn("mix");
    that.nextRow();
    that.addLabeledContent(controls.mix.gainL = gSlider(mix.getArgs().gainL, 0.0, 1.0, setGainL), "L");
    that.addLabeledContent(controls.mix.gainR = gSlider(mix.getArgs().gainR, 0.0, 1.0, setGainR), "R");

    that.setGuiControls(controls);
    
    //FIXME: global coupling!
    audioWork.mixerOut.addInput(mix);
    
    return that;
}