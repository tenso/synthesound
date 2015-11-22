"use strict";
/*global SBase*/
/*global extend*/
/*global DelayBuffer*/

function SDelay() {
    SBase.call(this);
    this.maxDelay = 480000; //10s at 48khz
    this.delay = 0.5; //seconds
    this.gain = 0.5;
    this.delayBuffer = [];
    this.delayBuffer[0] = new DelayBuffer(this.maxDelay);
    this.delayBuffer[1] = new DelayBuffer(this.maxDelay);
}
extend(SBase, SDelay);


SDelay.prototype.makeAudio = function () {
    var i = 0,
        chan = 0,
        chanData,
        inputIndex;

    for (chan = 0; chan < this.channels; chan += 1) {
        chanData = this.data[chan];
        
        for (inputIndex = 0; inputIndex < this.inputs.length; inputIndex += 1) {
            for (i = 0; i < chanData.length; i += 1) {
                this.delayBuffer[chan].set(this.inputs[inputIndex].data[chan][i]);
                chanData[i] = this.gain * this.delayBuffer[chan].get(parseInt(this.delay * this.sampleRate, 10));
            }
        }
    }
};

SDelay.prototype.setGain = function (gain) {
    this.gain = gain;
};

SDelay.prototype.setDelay = function (delay) {
    this.delay = delay;
};