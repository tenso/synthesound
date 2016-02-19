/*jslint node: true */

/*global sBase*/

"use strict";

function sOp(args) {
    var that = sBase("op");

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
                    if (inputIndex === 0) {
                        chanData[i] = inputData[i];
                    } else if (that.args.op === "+") {
                        chanData[i] += inputData[i];
                    } else if (that.args.op === "*") {
                        chanData[i] *= inputData[i];
                    } else if (that.args.op === "-") {
                        chanData[i] -= inputData[i];
                    } else if (that.args.op === "%") {
                        chanData[i] %= inputData[i];
                    }
                }
            }
        }
    };

    that.initArgs({
        op: "*"
    }, args);

    return that;
}
