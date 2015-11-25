"use strict";
/*global sBase*/

function sGen(args) {
    var that = sBase(),
        inPhase = 0;
    
    that.amp = 0.1;
    that.phase = 0;
    that.freq = 220;
    that.type = "sine";
    that.isOn = true;
    
    that.makeAudio = function () {
        //FIXME: this only samples first sample of frameSize
        if (that.haveSpecialInput("freq")) {
            that.freq = that.getSpecialChannelData("freq", 0)[0];
        }

        var i = 0,
            chan = 0,
            T = (2 * Math.PI * that.freq) / that.sampleRate(),
            period = that.sampleRate() / (that.freq),
            phaseStep,
            inPeriod;

        for (i = 0; i < that.wantedSamples(); i += 1) {
            if (!that.isOn) {
                that.genData[i] = 0;
            } else if (that.type === "sine") {
                inPhase += T;
                that.genData[i] = that.amp * Math.sin(inPhase + that.phase);
            } else if (that.type === "square") {
                inPhase += 1;
                inPeriod = (inPhase + that.phase) % period;
                that.genData[i] = that.amp * (inPeriod < (period / 2.0) ? 1.0 : -1.0);
            }
        }

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            that.data[chan] = that.genData.slice();
        }
    };

    that.setArgs = function (args) {
        if (args) {
            that.amp = typeof args.amp === "number" ? args.amp : that.amp;
            that.freq = typeof args.freq === "number" ? args.freq : that.freq;
            that.phase = typeof args.phase === "number" ? args.phase : that.phase;
            that.type = typeof args.type === "string" ? args.type : that.type;
        }
    };
    that.setArgs(args);
    return that;
}

