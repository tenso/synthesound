"use strict";
/*global sDelay*/
/*global sCBase*/
/*global gSlider*/

function sCDelay(container, uid) {
    var delay = sDelay({gain: 0.1, delay: 0.15}),
        that = sCBase(container, "sCDelay", delay, uid),
        controls = {};

    controls.gain = gSlider(delay.getArgs().gain, 0.0, 0.99, function (value) {that.setAndSaveArgs({gain: value}); });
    controls.delay = gSlider(delay.getArgs().delay, 0.0, 1.0, function (value) {that.setAndSaveArgs({delay: value}); });

    that.addIn().addOut();
    that.nextRow();
    that.addTabled(controls.gain, "G");
    that.addTabled(controls.delay, "D");

    that.setGuiControls(controls);

    return that;
}
