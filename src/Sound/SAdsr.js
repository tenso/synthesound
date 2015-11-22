"use strict";
/*global SBase*/
/*global extend*/

function SAdsr(args) {
    SBase.call(this);
    
    this.a = 0.1; /*seconds*/
    this.d = 0.1; /*seconds*/
    this.s = 0.3; /*0-1*/
    this.r = 1.0; /*seconds*/
    
    this.active = false;
    this.activeIndex = 0;
    this.releaseIndex = 0;
    this.gainAtRelease = 0.0;
    this.tick = 0;
    this.lastGain = 0.0;

    this.setArgs(args);
}
extend(SBase, SAdsr);

SAdsr.prototype.makeAudio = function () {
    
    var index = 0,
        i = 0,
        chan = 0,
        chanData,
        period,
        inPeriod,
        inputIndex,
        aLen = this.a * this.sampleRate,
        dLen = this.d * this.sampleRate,
        rLen = this.r * this.sampleRate;
        
    for (chan = 0; chan < this.channels; chan += 1) {
        chanData = this.data[chan];

        for (i = 0; i < chanData.length; i += 1) {
        
            if (this.active) {
                index = this.tick - this.activeIndex + i;
                
                if (index < aLen) {
                    this.lastGain = index / aLen;
                } else if (index < aLen + dLen) {
                    index -= aLen;
                    this.lastGain = 1.0 - ((1.0 - this.s) * (index / dLen));
                } else {
                    this.lastGain = this.s;
                }
            } else {
                index = this.tick - this.releaseIndex + i;
                if (index <= rLen) {
                    this.lastGain = this.gainAtRelease * (1.0 - (index / rLen));
                } else {
                    this.lastGain = 0.0;
                }
            }
            for (inputIndex = 0; inputIndex < this.inputs.length; inputIndex += 1) {
                chanData[i] = this.lastGain * this.inputs[inputIndex].data[chan][i];
            }
        }
    }
    this.tick += this.frameSize;
};
    
SAdsr.prototype.setArgs = function (args) {
    if (args) {
        this.a = typeof args.a === "number" ? args.a : this.a;
        this.d = typeof args.d === "number" ? args.d : this.d;
        this.s = typeof args.s === "number" ? args.s : this.s;
        this.r = typeof args.r === "number" ? args.r : this.r;
    }
};

SAdsr.prototype.setActive = function (active) {
    if (!this.active && active) {
        this.activeIndex = this.tick - (this.lastGain * this.a * this.sampleRate);
    } else if (this.active) {
        this.gainAtRelease = this.lastGain;
        this.releaseIndex = this.tick;
    }
    this.active = active;
};