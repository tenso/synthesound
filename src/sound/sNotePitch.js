"use strict";
/*global sBase*/
/*global note*/

function sNotePitch(args) {
    var that = sBase("op"),
        octaves = 0,
        notes = 0,
        cents = 0,
        lastNote,
        noteUpdatedCb;

    that.makeAudio = function () {
        var i = 0,
            chan = 0,
            chanData,
            inputData,
            inputIndex;

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            chanData = that.data[chan];
            for (inputIndex = 0; inputIndex < that.numInputs(); inputIndex += 1) {
                inputData = that.getInputChannelData(inputIndex, chan);
                for (i = 0; i < chanData.length; i += 1) {
                    lastNote = note.note(inputData[i]);
                    chanData[i] = note.hz(lastNote + octaves * 12 + notes + cents / 100);
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
        return note.name(lastNote + octaves * 12 + notes) + "+" + cents + "/100";
    };
    
    that.getArgs = function () {
        return {octaves: octaves, notes: notes, cents: cents};
    };
    
    that.setArgs = function (args) {
        if (args) {
            octaves = typeof args.octaves === "number" ? args.octaves : octaves;
            notes = typeof args.notes === "number" ? args.notes : notes;
            cents = typeof args.cents === "number" ? args.cents : cents;
        }
    };
    
    that.setArgs(args);
    
    return that;
}