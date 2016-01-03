"use strict";
/*global gui*/
/*global sNotePitch*/
/*global gInput*/
/*global gLabel*/
/*global sCBase*/

function sCNotePitch(container, uid) {
    var out = sNotePitch(),
        that = sCBase(container, "sCNotePitch", {hz: out}, uid),
        labelIn,
        labelOut,
        controls = {hz: {}};

    function addControl(type) {
        var args;

        controls.hz[type] = gInput(out.getArgs()[type], function (value) {
            args = {};
            args[type] = parseInt(value, 10);
            that.setAndSaveArgs("hz", args);
        }, type);

        that.addContent(controls.hz[type]);
    }

    labelIn = gLabel("--").w(60).fontSize(10);
    that.addContent(labelIn);
    that.addIn("hz");

    labelOut = gLabel("--").w(60).fontSize(10);
    that.addContent(labelOut);
    that.addOut("hz");

    that.nextRow();
    addControl("octaves");
    addControl("notes");
    addControl("cents");

    out.setNoteUpdatedCallback(function (inNote, outNote) {
        labelIn.setValue(inNote);
        labelOut.setValue(outNote);
    });

    that.setGuiControls(controls);

    return that;
}
