/*jslint node: true */

/*global sBase*/

"use strict";

function sConst(args) {
    var that = sBase("const"),
        outData;

    that.makeAudio = function () {
        var chan = 0;

        if (that.argsUpdated()) {
            for (chan = 0; chan < that.numChannels(); chan += 1) {
                outData = that.getChannelData(chan);
                outData.fill(that.args.value);
            }
        }
    };

    that.initArgs({
        value: 1.0
    }, args);

    return that;
}
