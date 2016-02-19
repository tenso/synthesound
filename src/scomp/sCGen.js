/*jslint node: true */

/*global sGen*/
/*global sCBase*/
/*global gButton*/
/*global gButtonGroup*/
/*global gInput*/

"use strict";

function sCGen(container, uid) {
    var out = sGen({freq: 110, amp: 0.25, type: "sine"}),
        that = sCBase(container, "sCGen", out, uid),
        buttonGroup = gButtonGroup(),
        ampControl;

    function addShape(shape) {
        var button = gButton(shape, function () {that.setAndSaveArgs({type: shape}); }, true, buttonGroup);
        if (out.getArgs().type === shape) {
            button.set(true);
        }
        that.addTabled(button);
    }

    ampControl = gInput(out.getArgs().amp, function (value) {
        that.setAndSaveArgs({amp: parseFloat(value)});
    }, "amp");

    that.addIn("freq").addOut();
    that.addTabled(ampControl);

    that.nextRow();
    addShape("sine");
    addShape("square");
    addShape("saw");
    that.nextRow();
    addShape("triangle");
    addShape("noise");

    that.setGuiControls({
        type: buttonGroup,
        amp: ampControl
    });

    return that;
}
