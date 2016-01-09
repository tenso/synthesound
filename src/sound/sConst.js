"use strict";
/*global sBase*/

function sConst(args) {
    var that = sBase("const"),
        valueChanged = true,
        value = 1.0,
        outData;

    that.makeAudio = function () {
        var chan = 0;

        if (valueChanged) {
            for (chan = 0; chan < that.numChannels(); chan += 1) {
                outData = that.getChannelData(chan);
                outData.fill(value);
            }
            valueChanged = false;
        }
    };

    that.getArgs = function () {
        return {value: value};
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
