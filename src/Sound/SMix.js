"use strict";
/*global SBase*/
/*global extend*/

function SMix() {
    SBase.call(this);
}
extend(SBase, SMix);


SMix.prototype.makeAudio = function () {
    var i = 0,
        chan = 0,
        chanData,
        inputIndex;

    this.generateInputs();
    
    for (chan = 0; chan < this.channels; chan += 1) {
        chanData = this.data[chan];
        chanData.fill(0);
        for (inputIndex = 0; inputIndex < this.inputs.length; inputIndex += 1) {
            for (i = 0; i < chanData.length; i += 1) {
                chanData[i] += this.gain * this.inputs[inputIndex].data[chan][i];
            }
        }
    }
};

SMix.prototype.setGain = function (gain) {
    this.gain = gain;
};