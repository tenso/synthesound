"use strict";
/*global sBase*/

function sConst() {
    var that = sBase();
        
    that.value = 1.0;
    
    that.makeAudio = function () {
        var chan = 0;

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            that.data[chan].fill(that.value);
        }
    };
    return that;
}

