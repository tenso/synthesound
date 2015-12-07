"use strict";
/*global sBase*/

//FIXME: calc array once

function sConst(args) {
    var that = sBase(),
        valueChanged = true,
        value = 1.0;
    
    that.title = "const";
    
    that.makeAudio = function () {
        var chan = 0;

        if (valueChanged) {
            for (chan = 0; chan < that.numChannels(); chan += 1) {
                that.data[chan].fill(value);
            }
            valueChanged = false;
        }
    };
    
    that.getArgs = function () {
        return {"value": value};
    };
    
    that.setArgs = function (args) {
        var newValue;
        if (args) {
            newValue = typeof args.value === "number" ? args.value : value;
            if (newValue !== value) {
                valueChanged = true;
                value = newValue;
            }
        }
    };
    that.setArgs(args);
    
    return that;
}