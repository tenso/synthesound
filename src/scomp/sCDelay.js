"use strict";
/*global sDelay*/
/*global sCBase*/
/*global gSlider*/

function sCDelay(container, uid) {
    var delay = sDelay({gain: 0.1, delay: 0.15}),
        that = sCBase(container, "sCDelay", {delay: delay}, uid),
        controls = {delay: {}};

    that.addIn("delay").addOut("delay");
    that.nextRow();
    that.addLabeledContent(controls.delay.gain = gSlider(delay.getArgs().gain, 0.0, 0.99, function (value) {that.setAndSaveArgs("delay", {gain: value}); }), "G");
    that.addLabeledContent(controls.delay.delay = gSlider(delay.getArgs().delay, 0.0, 1.0, function (value) {that.setAndSaveArgs("delay", {delay: value}); }), "D");

    that.setGuiControls(controls);

    return that;
}
