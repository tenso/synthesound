"use strict";
/*global sBase*/

function sGen(args) {
    var that = sBase("gen"),
        phaseRun = 0,
        amp = 0.1,
        phase = 0,
        freq = 220,
        type = "sine",
        isOn = true,
        TwoPi = 2 * Math.PI;
    
    that.makeAudio = function () {
        var i = 0,
            chan = 0,
            sRate = that.sampleRate(),
            period = sRate,
            hPeriod = period / 2.0,
            phaseStep,
            newFreq = freq,
            inPeriod;
        
        
        phaseStep = freq / sRate;
        for (i = 0; i < that.wantedSamples(); i += 1) {
            
            if (that.haveSpecialInput("freq")) {
                newFreq = that.getSpecialChannelData("freq", 0)[i];
            }
            
            if (newFreq !== freq) {
                freq = newFreq;
                phaseStep = freq / sRate;
            }
            phaseRun += phaseStep;
            inPeriod = (phaseRun + phase) * sRate;
            inPeriod %= sRate;
            
            if (!isOn) {
                that.genData[i] = 0;
            } else if (type === "sine") {
                that.genData[i] = Math.sin(TwoPi * (phaseRun + phase));
            } else if (type === "square") {
                that.genData[i] = inPeriod < hPeriod ? 1.0 : -1.0;
            } else if (type === "triangle") {
                if (inPeriod <  hPeriod) {
                    that.genData[i] = -1.0 + (2.0 * (inPeriod  / hPeriod));
                } else {
                    that.genData[i] = 1.0 - (2.0 * (inPeriod - hPeriod)  / hPeriod);
                }
            } else if (type === "saw") {
                that.genData[i] = -1.0 + (2.0 * (inPeriod  / period));
            } else if (type === "noise") {
                that.genData[i] = -1.0 + 2.0 * Math.random();
            }
            
            that.genData[i] *= amp;
        }

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            that.data[chan] = that.genData.slice();
        }
    };

    that.getArgs = function () {
        return {amp: amp, freq: freq, phase: phase, type: type, isOn: isOn};
    };
    
    that.setArgs = function (args) {
        if (args) {
            amp = typeof args.amp === "number" ? args.amp : amp;
            freq = typeof args.freq === "number" ? args.freq : freq;
            phase = typeof args.phase === "number" ? args.phase : phase;
            type = typeof args.type === "string" ? args.type : type;
            isOn = typeof args.isOn === "boolean" ? args.type : isOn;
        }
    };
    that.setArgs(args);
    return that;
}

