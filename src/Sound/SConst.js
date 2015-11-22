"use strict";
/*global SBase*/
/*global extend*/

function SConst() {
    SBase.call(this);
    this.value = 1.0;
}
extend(SBase, SConst);

SConst.prototype.makeAudio = function () {
    var i = 0,
        chan = 0,
        chanData,
        inputIndex;
        
    for (chan = 0; chan < this.channels; chan += 1) {
        this.data[chan].fill(this.value);
    }
};
