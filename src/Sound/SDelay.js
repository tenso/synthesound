"use strict";
/*global sBase*/
/*global DelayBuffer*/

function sDelay() {
    var that = sBase(),
        maxDelay = 480000, //10s at 48khz
        delayBuffer = [],
        gain = 0.5,
        delay = 0.5;

    delayBuffer[0] = new DelayBuffer(maxDelay);
    delayBuffer[1] = new DelayBuffer(maxDelay);
    
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
                    delayBuffer[chan].set(inputData[i]);
                    chanData[i] = gain * delayBuffer[chan].get(parseInt(delay * that.sampleRate(), 10));
                }
            }
        }
    };

    that.setGain = function (value) {
        gain = value;
    };
    
    that.getGain = function () {
        return gain;
    };

    that.setDelay = function (value) {
        delay = value;
    };
    
    that.getDelay = function () {
        return delay;
    };
    
    return that;
}
