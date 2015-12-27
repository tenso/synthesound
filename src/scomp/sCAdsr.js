"use strict";
/*global sAdsr*/
/*global sCBase*/
/*global gSlider*/

function sCAdsr(container, uid) {
    var adsr = sAdsr({a: 0.01, d: 0.15, s: 0.5, r: 0.01}),
        controls = {adsr: {}},
        that = sCBase(container, "sCAdsr", {adsr: adsr}, uid);
    
    that.addIn("adsr").addIn("adsr", "gate").addOut("adsr");
    
    that.nextRow();
    that.addLabeledContent(controls.adsr.a = gSlider(adsr.getArgs().a, 0.01, 1.0, function (value) {adsr.setArgs({a: value}); }), "A");
    that.addLabeledContent(controls.adsr.d = gSlider(adsr.getArgs().d, 0.01, 1.0, function (value) {adsr.setArgs({d: value}); }), "D");
    that.addLabeledContent(controls.adsr.s = gSlider(adsr.getArgs().s, 0.0, 1.0, function (value) {adsr.setArgs({s: value}); }), "S");
    that.addLabeledContent(controls.adsr.r = gSlider(adsr.getArgs().r, 0.01, 1.0, function (value) {adsr.setArgs({r: value}); }), "R");
    
    that.setGuiControls(controls);
    
    return that;
}