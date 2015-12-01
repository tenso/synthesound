"use strict";
/*global sBase*/
/*global delayBuffer*/

function sDelay(args) {
    var that = sBase(),
        maxDelay = 480000, //10s at 48khz
        buffer = [],
        gain = 0.5,
        delay = 0.5;
    

    buffer[0] = delayBuffer(maxDelay);
    buffer[1] = delayBuffer(maxDelay);
    
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
                    buffer[chan].set(inputData[i]);
                    //FIXME: cant get value like this, need  similar solution to continous-phase for generators.
                    chanData[i] = gain * buffer[chan].get(parseInt(delay * that.sampleRate(), 10));
                }
            }
        }
    };

    that.getArgs = function () {
        return {"gain": gain, "delay": delay};
    };
    
    that.setArgs = function (args) {
        if (args) {
            gain = typeof args.gain === "number" ? args.gain : gain;
            delay = typeof args.delay === "number" ? args.delay : delay;
        }
    };
    that.setArgs(args);
    
    return that;
}
