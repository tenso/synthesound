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
        currentNote = gLabel("--").abs().move(12, 50).setSize(40, 20).bg("#888").color("#000").border("2px solid #888").radius(4),
        isDown = false,
        keyboard,
        noteDisplay = {
            setValue: function () {
                currentNote.setValue(note.name(note.note(hz.getArgs().value)));

                if (gate.getArgs().active) {
                    currentNote.borderColor("#f00");
                } else {
                    currentNote.borderColor("#888");
                }
            }
        };


    that.keyDown = function (noteKey) {
        var hz = note.hz(noteKey);
        isDown = true;
        that.setAndSaveArgs("freq", {value: hz});
        that.setAndSaveArgs("gate", {active: isDown});
        noteDisplay.setValue(hz);
    };

    that.keyUp = function (noteKey) {
        var hz = note.hz(noteKey);
        isDown = false;
        that.setAndSaveArgs("freq", {value: hz});
        that.setAndSaveArgs("gate", {active: isDown});
        noteDisplay.setValue(hz);
    };

    that.addOut("gate").addOut("freq");

    that.addTabled(gButton("capture", function () {
        gui.captureKey(keyboard);
    }).abs().move(5, 170));

    that.addTabled(currentNote);

    gate.setArgs({value: isDown ? 1.0 : 0.0});

    keyboard = wVKey(that.keyDown, that.keyUp);
    that.addTabled(keyboard);

    that.setGuiControls({
        freq: {
            value: noteDisplay
        },
        gate: {
            active: noteDisplay
        }
    });

    return that;
}
