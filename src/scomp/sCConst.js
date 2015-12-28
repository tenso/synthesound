"use strict";
/*global gui*/
/*global sConst*/
/*global gInput*/
/*global sCBase*/

function sCConst(container, uid) {
    var out = sConst(),
        that = sCBase(container, "sCConst", {value: out}, uid),
        controls = {value: {}};

    that.addOut("value");
    that.addContent(controls.value.value = gInput(out.getArgs().value, function (value) {
        that.setAndSaveArgs("value", {value: parseFloat(value)});
    }, "value"));

    that.setGuiControls(controls);
    return that;
}