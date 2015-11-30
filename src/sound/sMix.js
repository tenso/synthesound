"use strict";
/*global sBase*/

function sMix() {
    var that = sBase();
    
    that.gain = [1.0, 1.0];

    that.makeAudio = function () {
        var i = 0,
            chan = 0,
            chanData,
            inputData,
            inputIndex;

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            chanData = that.data[chan];
            chanData.fill(0);
            for (inputIndex = 0; inputIndex < that.numInputs(); inputIndex += 1) {
                inputData = that.getInputChannelData(inputIndex, chan);
                for (i = 0; i < chanData.length; i += 1) {
                    chanData[i] += this.gain[chan] * inputData[i];
                }
            }
        }
    };

    that.setChannelGain = function (chan, gain) {
        that.gain[chan] = gain;
    };
    
    return that;
}