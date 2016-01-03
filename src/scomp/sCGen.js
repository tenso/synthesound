"use strict";
/*global sGen*/
/*global sCBase*/
/*global gButton*/
/*global gButtonGroup*/
/*global gInput*/

function sCGen(container, uid) {
    var out = sGen({freq: 110, amp: 0.25, type: "sine"}),
        that = sCBase(container, "sCGen", {gen: out}, uid),
        buttonGroup = gButtonGroup(),
        ampControl;

    function addShape(shape) {
        var button = gButton(shape, function () {that.setAndSaveArgs("gen", {type: shape}); }, true, buttonGroup);
        if (out.getArgs().type === shape) {
            button.set(true);
        }
        that.addContent(button);
    }

    ampControl = gInput(out.getArgs().amp, function (value) {
        that.setAndSaveArgs("gen", {amp: parseFloat(value)});
    }, "amp");

    that.addIn("gen", "freq").addOut("gen");
    that.addContent(ampControl);

    that.nextRow();
    addShape("sine");
    addShape("square");
    addShape("saw");
    that.nextRow();
    addShape("triangle");
    addShape("noise");



    that.setGuiControls({
        gen: {
            type: buttonGroup,
            amp: ampControl
        }
    });

    return that;
}
