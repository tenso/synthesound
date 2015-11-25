"use strict";
/*global sBase*/


function sAdsr(args) {
    var that = sBase(),
        active = false,
        activeIndex = 0,
        releaseIndex = 0,
        gainAtRelease = 0.0,
        tick = 0,
        lastGain = 0.0;
    
    that.a = 0.1; /*seconds*/
    that.d = 0.1; /*seconds*/
    that.s = 0.3; /*0-1*/
    that.r = 1.0; /*seconds*/

    that.makeAudio = function () {
        var index = 0,
            i = 0,
            chan = 0,
            chanData,
            period,
            inPeriod,
            inputIndex,
            inputData,
            aLen = that.a * that.sampleRate(),
            dLen = that.d * that.sampleRate(),
            rLen = that.r * that.sampleRate();

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            chanData = that.data[chan];

            for (i = 0; i < chanData.length; i += 1) {

                if (active) {
                    index = tick - activeIndex + i;

                    if (index < aLen) {
                        lastGain = index / aLen;
                    } else if (index < aLen + dLen) {
                        index -= aLen;
                        lastGain = 1.0 - ((1.0 - that.s) * (index / dLen));
                    } else {
                        lastGain = that.s;
                    }
                } else {
                    index = tick - releaseIndex + i;
                    if (index <= rLen) {
                        lastGain = gainAtRelease * (1.0 - (index / rLen));
                    } else {
                        lastGain = 0.0;
                    }
                }

                for (inputIndex = 0; inputIndex < that.numInputs(); inputIndex += 1) {
                    inputData = that.getInputChannelData(inputIndex, chan);
                    chanData[i] = lastGain * inputData[i];
                }
            }
        }
        tick += that.wantedSamples();
    };

    that.setActive = function (value) {
        if (!active && value) {
            activeIndex = tick - (lastGain * that.a * that.sampleRate());
        } else if (active && !value) {
            gainAtRelease = lastGain;
            releaseIndex = tick;
        }
        active = value;
    };
    
    that.setArgs = function (args) {
        if (args) {
            that.a = typeof args.a === "number" ? args.a : that.a;
            that.d = typeof args.d === "number" ? args.d : that.d;
            that.s = typeof args.s === "number" ? args.s : that.s;
            that.r = typeof args.r === "number" ? args.r : that.r;
        }
    };
    that.setArgs(args);
    
    return that;
}


