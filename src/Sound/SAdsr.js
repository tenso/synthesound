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
    
    this.lastGain = 0.0;
    this.input = null;
    
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
        aLen = this.a * this.sampleRate,
        dLen = this.d * this.sampleRate,
        rLen = this.r * this.sampleRate;
        

    this.input.generate(this.sampleRate, this.frameSize);
    
    for (chan = 0; chan < this.channels; chan += 1) {
        chanData = this.data[chan];

        for (i = 0; i < chanData.length; i += 1) {
            
            if (this.active) {
                index = this.runIndex - this.activeIndex + i;
                
                if (index < aLen) {
                    this.lastGain = index / aLen;
                } else if (index < aLen + dLen) {
                    index -= aLen;
                    this.lastGain = 1.0 - ((1.0 - this.s) * (index / dLen));
                } else {
                    this.lastGain = this.s;
                }
            } else {
                index = this.runIndex - this.releaseIndex + i;
                
                if (index < rLen) {
                    this.lastGain = this.gainAtRelease * (1.0 - (index / rLen));
                } else {
                    this.lastGain = 0;
                }
            }
            chanData[i] = this.lastGain * this.input.data[chan][i];
        }
    }
};
    
SAdsr.prototype.setArgs = function (args) {
    if (args) {
        this.a = args.a || this.a;
        this.d = args.d || this.d;
        this.s = args.s || this.s;
        this.r = args.r || this.r;
    }
};

SAdsr.prototype.setActive = function (active) {
    if (!this.active && active) {
        this.activeIndex = this.runIndex;
    } else if (this.active) {
        this.gainAtRelease = this.lastGain;
        this.releaseIndex = this.runIndex;
    }
    this.active = active;
};

SAdsr.prototype.setInput = function (input) {
    this.input = input;
};