"use strict";
/*global sAdsr*/
/*global sCBase*/
/*global gSlider*/

function sCAdsr(container, uid) {
    var adsr = sAdsr({a: 0.01, d: 0.15, s: 0.5, r: 0.01}),
        controls = {},
        that = sCBase(container, "sCAdsr", adsr, uid);

    function makeSet(param) {
        return function (value) {
            var args = {};
            args[param] = value;
            that.setAndSaveArgs(args);
        };
    }

    that.addIn().addIn("gate").addOut();

    controls.a = gSlider(adsr.getArgs().a, 0.01, 1.0, makeSet("a"));
    controls.d = gSlider(adsr.getArgs().d, 0.01, 1.0, makeSet("d"));
    controls.s = gSlider(adsr.getArgs().s, 0.00, 1.0, makeSet("s"));
    controls.r = gSlider(adsr.getArgs().r, 0.01, 1.0, makeSet("r"));

    that.nextRow();
    that.addTabled(controls.a, "A");
    that.addTabled(controls.d, "D");
    that.addTabled(controls.s, "S");
    that.addTabled(controls.r, "R");

    that.setGuiControls(controls);
    return that;
}
