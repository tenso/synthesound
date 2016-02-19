/*jslint node: true */

/*global sConst*/
/*global gInput*/
/*global sCBase*/

"use strict";

function sCConst(container, uid) {
    var out = sConst(),
        that = sCBase(container, "sCConst", out, uid),
        controls = {};

    controls.value = gInput(out.getArgs().value, function (value) {
        that.setAndSaveArgs({value: parseFloat(value)});
    }, "value");

    that.addOut();
    that.addTabled(controls.value);

    that.setGuiControls(controls);
    return that;
}
