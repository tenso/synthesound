"use strict";
/*global sBase*/

function sGen(args) {
    var that = sBase("gen"),
        inPhase = 0,
        amp = 0.1,
        phase = 0,
        freq = 220,
        type = "sine",
        isOn = true;
    
    that.makeAudio = function () {
        var i = 0,
            chan = 0,
            T,
            period,
            hPeriod,
            phaseStep,
            newFreq = freq,
            inPeriod;
        
        //FIXME: dubble code #1
        T = (2 * Math.PI * freq) / that.sampleRate();
        period = that.sampleRate() / (freq);
        hPeriod = period / 2.0;
        
        for (i = 0; i < that.wantedSamples(); i += 1) {
            
            if (that.haveSpecialInput("freq")) {
                newFreq = that.getSpecialChannelData("freq", 0)[i];
            }
            
            if (newFreq !== freq) {
                freq = newFreq;
                //FIXME: dubble code #1
                T = (2 * Math.PI * freq) / that.sampleRate();
                period = that.sampleRate() / (freq);
                hPeriod = period / 2.0;
            }
            inPeriod = (inPhase + phase) % period;
            
            if (!isOn) {
                that.genData[i] = 0;
            } else if (type === "sine") {
                inPhase += T;
                that.genData[i] = Math.sin(inPhase + phase);
            } else if (type === "square") {
                inPhase += 1;
                that.genData[i] = inPeriod < hPeriod ? 1.0 : -1.0;
            } else if (type === "triangle") {
                inPhase += 1;
                if (inPeriod <  hPeriod) {
                    that.genData[i] = -1.0 + (2.0 * (inPeriod  / hPeriod));
                } else {
                    that.genData[i] = 1.0 - (2.0 * (inPeriod - hPeriod)  / hPeriod);
                }
            } else if (type === "saw") {
                inPhase += 1;
                that.genData[i] = -1.0 + (2.0 * (inPeriod  / (period)));
            } else if (type === "noise") {
                inPhase += 1;
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

