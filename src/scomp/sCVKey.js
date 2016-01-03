"use strict";
/*global sConst*/
/*global sStep*/
/*global gui*/
/*global note*/
/*global wVKey*/
/*global sCBase*/
/*global gLabel*/
/*global gButton*/

function sCVKey(container, uid) {
    var gate = sStep(),
        hz = sConst(),
        that = sCBase(container, "sCVKey", {gate: gate, freq: hz}, uid),
        currentNote = gLabel("--").abs().move(12, 50).setSize(40, 20).bg("#888").color("#fff").radius(4),
        isDown = false,
        keyboard;

    that.keyDown = function (notePressed) {
        isDown = true;

        currentNote.setValue(note.name(notePressed));

        that.setAndSaveArgs("gate", {active: isDown});
        that.setAndSaveArgs("freq", {value: note.hz(notePressed)});
    };

    that.keyUp = function () {
        isDown = false;
        that.setAndSaveArgs("gate", {active: isDown});
    };

    that.addOut("gate").addOut("freq");

    that.addTabled(gButton("capture", function () {
        gui.captureKey(keyboard);
    }).abs().move(10, 175));

    that.addTabled(currentNote);

    gate.setArgs({value: isDown ? 1.0 : 0.0});

    keyboard = wVKey(that.keyDown, that.keyUp);
    that.addTabled(keyboard);

    return that;
}
