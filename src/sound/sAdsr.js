"use strict";
/*global sBase*/
/*global util*/

function sAdsr(args) {
    var that = sBase("adsr"),
        active = false,
        activeIndex = 0,
        releaseIndex = 0,
        gainAtRelease = 0.0,
        tick = 0,
        lastGain = 0.0;

    function setActive(value) {
        if (!active && value) {
            activeIndex = tick - (lastGain * that.args.a * that.sampleRate());
        } else if (active && !value) {
            gainAtRelease = lastGain;
            releaseIndex = tick;
        }
        active = value;
    }

    that.makeAudio = function () {
        var index = 0,
            i = 0,
            chan = 0,
            chanData,
            inputIndex,
            inputData,
            nextActive = false,
            aLen = that.args.a * that.sampleRate(),
            dLen = that.args.d * that.sampleRate(),
            rLen = that.args.r * that.sampleRate();

        that.setChannelDataZero();

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            chanData = that.getChannelData(chan);

            for (i = 0; i < that.wantedSamples(); i += 1) {

                if (that.numInputs("gate") && chan === 0) {
                    nextActive = that.getInputChannelData(0, chan, "gate")[i];
                    if (nextActive !== active) {
                        setActive(nextActive);
                    }
                }

                if (active) {
                    index = tick - activeIndex + i;

                    if (index < aLen) {
                        lastGain = index / aLen;
                    } else if (index < aLen + dLen) {
                        index -= aLen;
                        lastGain = 1.0 - ((1.0 - that.args.s) * (index / dLen));
                    } else {
                        lastGain = that.args.s;
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
                    chanData[i] += lastGain * inputData[i];
                }
            }
        }
        tick += that.wantedSamples();
    };

    that.initArgs({
        a: 0.1, /*seconds*/
        d: 0.1, /*seconds*/
        s: 0.3, /*0-1*/
        r: 1.0  /*seconds*/
    }, args);

    return that;
}


