"use strict";
/*global sAdsr*/
/*global sCBase*/
/*global gSlider*/

function sCAdsr(container, uid) {
    var adsr = sAdsr({a: 0.01, d: 0.15, s: 0.5, r: 0.01}),
        controls = {adsr: {}},
        that = sCBase(container, "sCAdsr", {adsr: adsr}, uid);

    function makeSet(param) {
        return function (value) {
            var args = {};
            args[param] = value;
            that.setAndSaveArgs("adsr", args);
        };
    }

    that.addIn("adsr").addIn("adsr", "gate").addOut("adsr");

    controls.adsr.a = gSlider(adsr.getArgs().a, 0.01, 1.0, makeSet("a"));
    controls.adsr.d = gSlider(adsr.getArgs().d, 0.01, 1.0, makeSet("d"));
    controls.adsr.s = gSlider(adsr.getArgs().s, 0.00, 1.0, makeSet("s"));
    controls.adsr.r = gSlider(adsr.getArgs().r, 0.01, 1.0, makeSet("r"));

    that.nextRow();
    that.addTabled(controls.adsr.a, "A");
    that.addTabled(controls.adsr.d, "D");
    that.addTabled(controls.adsr.s, "S");
    that.addTabled(controls.adsr.r, "R");

    that.setGuiControls(controls);
    return that;
}
