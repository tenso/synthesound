"use strict";
/*global sBase*/

function sMix(args) {
    var that = sBase("mix");

    that.makeAudio = function () {
        var i = 0,
            chan = 0,
            chanData,
            inputData,
            inputIndex,
            gain;

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            gain = chan === 0 ? that.args.gainL : that.args.gainR;
            chanData = that.getChannelData(chan);
            chanData.fill(0);
            for (inputIndex = 0; inputIndex < that.numInputs(); inputIndex += 1) {
                inputData = that.getInputChannelData(inputIndex, chan);
                for (i = 0; i < chanData.length; i += 1) {
                    chanData[i] += gain * inputData[i];
                }
            }
        }
    };

    that.initArgs({
        gainL: 1.0,
        gainR: 1.0
    }, args);

    return that;
}
