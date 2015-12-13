"use strict";
/*global sAdsr*/
/*global sCBase*/
/*global gSlider*/

function sCAdsr(container, args) {
    var that,
        adsr = sAdsr({a: 0.01, d: 0.15, s: 0.5, r: 0.01});

    that = sCBase(container, "sCAdsr", {adsr: adsr}, args);
    that.addIn("adsr").addIn("adsr", "gate").addOut("adsr");
    
    that.nextRow();
    that.addLabeledContent(gSlider(adsr.getArgs().a, 0.01, 1.0, function (value) {adsr.setArgs({a: value}); }), "A");
    that.addLabeledContent(gSlider(adsr.getArgs().d, 0.01, 1.0, function (value) {adsr.setArgs({d: value}); }), "D");
    that.addLabeledContent(gSlider(adsr.getArgs().s, 0.0, 1.0, function (value) {adsr.setArgs({s: value}); }), "S");
    that.addLabeledContent(gSlider(adsr.getArgs().r, 0.01, 1.0, function (value) {adsr.setArgs({r: value}); }), "R");
        
    return that;
}