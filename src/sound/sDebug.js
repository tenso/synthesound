"use strict";
/*global sBase*/
/*global window*/

function sDebug() {
    var that = sBase("debug"),
        lastValues = {};

    that.makeAudio = function () {
        var i = 0,
            chan = 0,
            chanData,
            inputData,
            inputIndex,
            newVal;

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            chanData = that.getChannelData(chan);

            for (inputIndex = 0; inputIndex < that.numInputs(); inputIndex += 1) {
                if (!lastValues[inputIndex]) {
                    lastValues[inputIndex] = [];
                    lastValues[inputIndex].length = that.numChannels();
                    lastValues[inputIndex].fill(0);
                }

                inputData = that.getInputChannelData(inputIndex, chan);

                for (i = 0; i < chanData.length; i += 1) {
                    newVal = inputData[i];
                    if (lastValues[inputIndex][chan] !== newVal) {
                        window.console.log("input:" + inputIndex + " chan:" + chan + " now:" + newVal);
                        lastValues[inputIndex][chan] = newVal;
                    }
                }
            }
        }
    };

    return that;
}
