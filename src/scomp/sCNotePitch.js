/*jslint node: true */

/*global sNotePitch*/
/*global gInput*/
/*global gLabel*/
/*global sCBase*/

"use strict";

function sCNotePitch(container, uid) {
    var out = sNotePitch(),
        that = sCBase(container, "sCNotePitch", out, uid),
        labelIn,
        labelOut,
        controls = {};

    function addControl(type) {
        var args;

        controls[type] = gInput(out.getArgs()[type], function (value) {
            args = {};
            args[type] = parseInt(value, 10);
            that.setAndSaveArgs(args);
        }, type).w(30);

        that.addTabled(controls[type]);
    }

    labelIn = gLabel("--").w(60).fontSize(12);
    that.addTabled(labelIn);
    that.addIn();

    labelOut = gLabel("--").w(60).fontSize(12);
    that.addTabled(labelOut);
    that.addOut();

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
