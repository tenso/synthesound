/*jslint node: true */

/*global sMix*/
/*global gSlider*/
/*global sCBase*/

"use strict";

function sCOut(container, uid) {
    var mix = sMix(),
        that = sCBase(container, "sCOut", mix, uid),
        controls = {};

    function setGainL(value) {
        that.setAndSaveArgs({gainL: value});
    }

    function setGainR(value) {
        that.setAndSaveArgs({gainR: value});
    }

    controls.gainL = gSlider(mix.getArgs().gainL, 0.0, 1.0, setGainL);
    controls.gainR = gSlider(mix.getArgs().gainR, 0.0, 1.0, setGainR);

    that.addIn();
    that.nextRow();
    that.addTabled(controls.gainL, "L");
    that.addTabled(controls.gainR, "R");

    that.setGuiControls(controls);

    that.toMainOutput = true;

    return that;
}
