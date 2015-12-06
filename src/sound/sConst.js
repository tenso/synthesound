"use strict";
/*global sBase*/

function sConst(args) {
    var that = sBase(),
        value = 1.0;
    
    that.makeAudio = function () {
        var chan = 0;

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            that.data[chan].fill(value);
        }
    };
    
    that.getArgs = function () {
        return {"value": value};
    };
    
    that.setArgs = function (args) {
        if (args) {
            value = typeof args.value === "number" ? args.value : value;
        }
    };
    that.setArgs(args);
    
    return that;
}