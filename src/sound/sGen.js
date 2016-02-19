/*jslint node: true */

/*global sBase*/

"use strict";

function sGen(args) {
    var that = sBase("gen"),
        phaseRun = 0,
        TwoPi = 2 * Math.PI;

    that.makeAudio = function () {
        var i = 0,
            chan = 0,
            sRate = that.sampleRate(),
            period = sRate,
            hPeriod = period / 2.0,
            phaseStep,
            newFreq = that.args.freq,
            inPeriod,
            outData;


        phaseStep = that.args.freq / sRate;
        for (i = 0; i < that.wantedSamples(); i += 1) {
            if (that.numInputs("freq")) {
                newFreq = that.getInputChannelData(0, 0, "freq")[i];
            }

            if (newFreq !== that.args.freq) {
                that.args.freq = newFreq;
                phaseStep = that.args.freq / sRate;
            }
            phaseRun += phaseStep;
            inPeriod = (phaseRun + that.args.phase) * sRate;
            inPeriod %= sRate;

            if (!that.args.isOn) {
                that.genData[i] = 0;
            } else if (that.args.type === "sine") {
                that.genData[i] = Math.sin(TwoPi * (phaseRun + that.args.phase));
            } else if (that.args.type === "square") {
                that.genData[i] = inPeriod < hPeriod ? 1.0 : -1.0;
            } else if (that.args.type === "triangle") {
                if (inPeriod <  hPeriod) {
                    that.genData[i] = -1.0 + (2.0 * (inPeriod  / hPeriod));
                } else {
                    that.genData[i] = 1.0 - (2.0 * (inPeriod - hPeriod)  / hPeriod);
                }
            } else if (that.args.type === "saw") {
                that.genData[i] = -1.0 + (2.0 * (inPeriod  / period));
            } else if (that.args.type === "noise") {
                that.genData[i] = -1.0 + 2.0 * Math.random();
            }

            that.genData[i] *= that.args.amp;
        }

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            outData = that.getChannelData(chan);
            for (i = 0; i < that.wantedSamples(); i += 1) {
                outData[i] = that.genData[i];
            }
        }
    };

    that.initArgs({
        amp: 0.1,
        phase: 0,
        freq: 220,
        type: "sine",
        isOn: true
    }, args);

    return that;
}

