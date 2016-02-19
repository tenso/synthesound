/*jslint node: true */

/*global sBase*/
/*global delayBuffer*/

"use strict";

function sDelay(args) {
    var that = sBase("delay"),
        maxDelay = 480000, //10s at 48khz
        buffer = [];

    that.makeAudio = function () {
        var i = 0,
            chan = 0,
            chanData,
            inputData,
            inputIndex;

        //NOTE: cant clear data if feedback to same componment is used
        //need to copy, also cant overwrite chanData as we go as this is the shared input
        that.setChannelDataZero();

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            chanData = that.getChannelData(chan);

            for (inputIndex = 0; inputIndex < that.numInputs(); inputIndex += 1) {
                inputData = that.getInputChannelData(inputIndex, chan);

                if (!buffer[chan]) {
                    buffer[chan] = [];
                }
                if (!buffer[chan][inputIndex]) {
                    buffer[chan][inputIndex] = delayBuffer(maxDelay);
                }

                for (i = 0; i < chanData.length; i += 1) {
                    buffer[chan][inputIndex].set(inputData[i]);
                    //FIXME: cant get value like this, need  similar solution to continous-phase for generators.
                    chanData[i] += that.args.gain * buffer[chan][inputIndex].get(parseInt(that.args.delay * that.sampleRate(), 10));
                }
            }
        }
    };

    that.initArgs({
        gain: 0.5,
        delay: 0.5
    }, args);

    return that;
}
