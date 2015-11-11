"use strict";
/*global SBase*/
/*global extend*/

function SGen(args) {
    SBase.call(this);
    
    this.amp = 0.1;
    this.phase = 0;
    this.freq = 220;
    this.type = "sine";
    this.tick = 0;
    this.setArgs(args);
}
extend(SBase, SGen);

SGen.prototype.makeAudio = function () {
    var index = 0,
        i = 0,
        chan = 0,
        chanData,
        period,
        inPeriod;

    for (chan = 0; chan < this.channels; chan += 1) {
        chanData = this.data[chan];

        for (i = 0; i < chanData.length; i += 1) {
            index = (this.tick + i);

            if (this.type === "sine") {
                chanData[i] = this.amp * Math.sin(2 * Math.PI * this.freq * index / this.sampleRate);
            } else if (this.type === "square") {
                period = this.sampleRate / (2.0 * this.freq);
                inPeriod = index % period;
                chanData[i] = this.amp * (inPeriod < (period / 2.0) ? 1.0 : -1.0);
            }
        }
    }
    this.tick += this.frameSize;
};
    
SGen.prototype.setArgs = function (args) {
    if (args) {
        this.amp = typeof args.amp === "number" ? args.amp : this.amp;
        this.freq = typeof args.freq === "number" ? args.freq : this.freq;
        this.phase = typeof args.phase === "number" ? args.phase : this.phase;
        this.type = typeof args.type === "string" ? args.type : this.type;
    }
};
