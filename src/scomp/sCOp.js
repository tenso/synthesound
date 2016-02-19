/*jslint node: true */

/*global sOp*/
/*global sCBase*/
/*global gButton*/
/*global gButtonGroup*/

"use strict";

function sCOp(container, uid) {
    var out = sOp(),
        that = sCBase(container, "sCOp", out, uid),
        buttonGroup = gButtonGroup();

    function addOp(op) {
        var button = gButton(op, function () {that.setAndSaveArgs({op: op}); }, true, buttonGroup).w(32);
        if (out.getArgs().op === op) {
            button.set();
        }
        that.addTabled(button);
    }

    that.addIn().addOut();

    that.nextRow();
    addOp("*");
    addOp("+");
    that.nextRow();
    addOp("-");
    addOp("%");

    that.setGuiControls({
        op: buttonGroup
    });

    return that;
}
