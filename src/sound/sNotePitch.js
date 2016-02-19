/*jslint node: true */

/*global sBase*/
/*global note*/

"use strict";

function sNotePitch(args) {
    var that = sBase("notePitch"),
        lastNote,
        noteUpdatedCb;

    that.makeAudio = function () {
        var i = 0,
            chan = 0,
            chanData,
            inputData,
            inputIndex;

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            chanData = that.getChannelData(chan);
            for (inputIndex = 0; inputIndex < that.numInputs(); inputIndex += 1) {
                inputData = that.getInputChannelData(inputIndex, chan);
                for (i = 0; i < chanData.length; i += 1) {
                    lastNote = note.note(inputData[i]);
                    chanData[i] = note.hz(lastNote + that.args.octaves * 12 + that.args.notes + that.args.cents / 100);
                }
            }
        }
        if (noteUpdatedCb) {
            noteUpdatedCb(that.inNoteName(), that.outNoteName());
        }
    };

    that.setNoteUpdatedCallback = function (cb) {
        noteUpdatedCb = cb;
    };

    that.inNoteName = function () {
        return note.name(lastNote);
    };

    that.outNoteName = function () {
        return note.name(lastNote + that.args.octaves * 12 + that.args.notes) + "+" + that.args.cents + "/100";
    };

    that.initArgs({
        octaves: 0,
        notes: 0,
        cents: 0
    }, args);

    return that;
}
