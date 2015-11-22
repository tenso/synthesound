"use strict";
/*global SBase*/
/*global extend*/

function SDebug() {
    SBase.call(this);
    this.lastValues = {};
}
extend(SBase, SDebug);


SDebug.prototype.makeAudio = function () {
    var i = 0,
        chan = 0,
        chanData,
        inputIndex,
        newVal;
        
    for (chan = 0; chan < this.channels; chan += 1) {
        chanData = this.data[chan];
        
        for (inputIndex = 0; inputIndex < this.inputs.length; inputIndex += 1) {
            if (!this.lastValues[inputIndex]) {
                this.lastValues[inputIndex] = new Array(this.channels);
                this.lastValues[inputIndex].fill(0);
            }
            for (i = 0; i < chanData.length; i += 1) {
                newVal = this.inputs[inputIndex].data[chan][i];
                if (this.lastValues[inputIndex][chan] !== newVal) {
                    window.console.log("input:" + inputIndex + " chan:" + chan + " now:" + newVal);
                    this.lastValues[inputIndex][chan] = newVal;
                }
            }
        }
    }
};