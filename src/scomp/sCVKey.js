"use strict";
/*global sNote*/
/*global gui*/
/*global note*/
/*global wVKey*/
/*global sCBase*/
/*global gLabel*/
/*global gButton*/

function sCVKey(container, uid) {
    var output = sNote(),
        that = sCBase(container, "sCVKey", output, uid),
        currentNote = gLabel("--").abs().move(12, 50).setSize(40, 20).bg("#888").color("#000").border("2px solid #888").radius(4),
        isDown = false,
        keyboard,
        noteDisplay = {
            setValue: function () {
                currentNote.setValue(note.name(note.note(output.getArgs().freq)));

                if (output.getArgs().gate) {
                    currentNote.borderColor("#f44");
                } else {
                    currentNote.borderColor("#888");
                }
            }
        };

    function saveKey(noteKey, down) {
        var hz = note.hz(noteKey);
        isDown = down;
        if (isDown) {
            that.setAndSaveArgs({gate: isDown, freq: hz}, true, isDown);
        } else {
            that.setAndSaveArgs({gate: isDown}, true, isDown);
        }
        noteDisplay.setValue(hz);
    }

    that.keyDown = function (noteKey) {
        saveKey(noteKey, true);
    };

    that.keyUp = function (noteKey) {
        saveKey(noteKey, false);
    };

    that.addOut("gate").addOut("freq");

    that.addTabled(gButton("capture", function () {
        gui.captureKey(keyboard);
    }).abs().move(5, 170));

    that.addTabled(currentNote);

    keyboard = wVKey(that.keyDown, that.keyUp);
    that.addTabled(keyboard);

    that.setGuiControls({
        gate: noteDisplay,
        freq: noteDisplay
    });

    that.setStateMode("notes");

    return that;
}
