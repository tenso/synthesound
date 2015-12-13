"use strict";
/*global sBase*/

function sAdsr(args) {
    var that = sBase("adsr"),
        active = false,
        activeIndex = 0,
        releaseIndex = 0,
        gainAtRelease = 0.0,
        tick = 0,
        lastGain = 0.0,
        a = 0.1, /*seconds*/
        d = 0.1, /*seconds*/
        s = 0.3, /*0-1*/
        r = 1.0; /*seconds*/
    
    function setActive(value) {
        if (!active && value) {
            activeIndex = tick - (lastGain * a * that.sampleRate());
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
            period,
            inPeriod,
            inputIndex,
            inputData,
            nextActive = false,
            aLen = a * that.sampleRate(),
            dLen = d * that.sampleRate(),
            rLen = r * that.sampleRate();

        that.setChannelDataZero();
        
        for (chan = 0; chan < that.numChannels(); chan += 1) {
            chanData = that.data[chan];

            for (i = 0; i < that.wantedSamples(); i += 1) {

                if (that.haveSpecialInput("gate") && chan === 0) {
                    nextActive = that.getSpecialChannelData("gate", chan)[i];
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
                        lastGain = 1.0 - ((1.0 - s) * (index / dLen));
                    } else {
                        lastGain = s;
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

    that.getArgs = function () {
        return {a: a, d: d, s: s, r: r, active: active};
    };
    
    that.setArgs = function (args) {
        if (args) {
            a = typeof args.a === "number" ? args.a : a;
            d = typeof args.d === "number" ? args.d : d;
            s = typeof args.s === "number" ? args.s : s;
            r = typeof args.r === "number" ? args.r : r;
            
            if (typeof args.active === "boolean") {
                setActive(args.active);
            }
        }
    };
    that.setArgs(args);
    return that;
}


