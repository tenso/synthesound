/*jslint node: true */

/*global sBase*/
/*global util*/

"use strict";

function sNote(args) {
    var that = sBase("note");

    that.makeAudio = function () {
        var chan = 0;

        if (that.argsUpdated()) {
            for (chan = 0; chan < that.numChannels(); chan += 1) {
                that.getChannelData(chan, "gate").fill(that.args.gate ? 1.0 : 0.0);
                that.getChannelData(chan, "freq").fill(that.args.freq);
            }
        }
    };

    that.initArgs({
        gate: false,
        freq: 1
    }, args, {
        gate: false
    });

    that.addOutput("gate");
    that.addOutput("freq");
    that.setArgs(args);

    return that;
}
