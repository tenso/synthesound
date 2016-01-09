"use strict";
/*global sBase*/

function sNote(args) {
    var that = sBase("note"),
        wantStep = false,
        stepDone = true,
        freq = 1,
        needRefill = true;

    that.makeAudio = function () {
        var chan = 0;

        if (needRefill) {
            if (stepDone) {
                needRefill = false;
            }
            for (chan = 0; chan < that.numChannels(); chan += 1) {
                that.getChannelData(chan, "gate").fill(wantStep ? 1.0 : 0.0);
                that.getChannelData(chan, "freq").fill(freq);
            }
            if (!stepDone) {
                for (chan = 0; chan < that.numChannels(); chan += 1) {
                    that.getChannelData(chan, "gate")[0] = 0.0;
                }
                stepDone = true;
            }
        }
    };

    that.getArgs = function () {
        return {
            gate: wantStep,
            freq: freq
        };
    };

    that.setArgs = function (args) {
        if (args) {
            wantStep = typeof args.gate === "boolean" ? args.gate : wantStep;
            freq = typeof args.freq === "number" ? args.freq : freq;
            stepDone = !wantStep;
            needRefill = true;
        }
    };

    that.addOutput("gate");
    that.addOutput("freq");
    that.setArgs(args);

    return that;
}
