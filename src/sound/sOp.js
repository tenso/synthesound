"use strict";
/*global sBase*/

function sOp(args) {
    var that = sBase("op"),
        op = "*";

    that.makeAudio = function () {
        var i = 0,
            chan = 0,
            chanData,
            inputData,
            inputIndex,
            result;

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            chanData = that.data[chan];
            for (inputIndex = 0; inputIndex < that.numInputs(); inputIndex += 1) {
                inputData = that.getInputChannelData(inputIndex, chan);
                for (i = 0; i < chanData.length; i += 1) {
                    if (inputIndex === 0) {
                        chanData[i] = inputData[i];
                    } else if (op === "+") {
                        chanData[i] += inputData[i];
                    } else if (op === "*") {
                        chanData[i] *= inputData[i];
                    } else if (op === "-") {
                        chanData[i] -= inputData[i];
                    } else if (op === "%") {
                        chanData[i] %= inputData[i];
                    }
                }
            }
        }
    };

    that.getArgs = function () {
        return {op: op};
    };

    that.setArgs = function (args) {
        if (args) {
            op = typeof args.op === "string" ? args.op : op;
        }
    };

    that.setArgs(args);

    return that;
}
