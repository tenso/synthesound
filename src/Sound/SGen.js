"use strict";
/*global SBase*/
/*global extend*/

function SGen(args) {
    SBase.call(this);
    
    this.amp = 0.1;
    this.phase = 0;
    this.freq = 220;
    this.type = "sine";
    this.inPhase = 0;
    this.setArgs(args);
    this.isOn = true;
}
extend(SBase, SGen);

SGen.prototype.makeAudio = function () {
    var i = 0,
        chan = 0,
        T = (2 * Math.PI * this.freq) / this.sampleRate,
        period = this.sampleRate / (this.freq),
        phaseStep,
        inPeriod;
    
    for (i = 0; i < this.frameSize; i += 1) {

        if (!this.isOn) {
            this.genData[i] = 0;    
        } else if (this.type === "sine") {
            this.inPhase += T;
            this.genData[i] = this.amp * Math.sin(this.inPhase + this.phase);
        } else if (this.type === "square") {
            this.inPhase += 1;
            inPeriod = (this.inPhase + this.phase) % period;
            this.genData[i] = this.amp * (inPeriod < (period / 2.0) ? 1.0 : -1.0);
        }
    }
    
    for (chan = 0; chan < this.channels; chan += 1) {
        this.data[chan] = this.genData.slice();
    }
};
    
SGen.prototype.setArgs = function (args) {
    if (args) {
        this.amp = typeof args.amp === "number" ? args.amp : this.amp;
        this.freq = typeof args.freq === "number" ? args.freq : this.freq;
        this.phase = typeof args.phase === "number" ? args.phase : this.phase;
        this.type = typeof args.type === "string" ? args.type : this.type;
    }
};
