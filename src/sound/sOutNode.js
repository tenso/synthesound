/*jslint node: true */

"use strict";

function sOutNode(audioCtx, channels, frameSize) {
    var that = audioCtx.createScriptProcessor(frameSize, 1, channels),
        runIndex = 0,
        genSize = 512,
        input;

    that.setInput = function (inputComp) {
        input = inputComp;
    };

    that.sampleRate = function () {
        return audioCtx.sampleRate;
    };

    that.numChannels = function () {
        return channels;
    };

    that.runIndexUpdated = undefined;

    that.onaudioprocess = function (audioEvent) {
        var chan = 0,
            generated,
            output = audioEvent.outputBuffer,
            genPhase = 0;

        output.normalize = false;

        for (genPhase = 0; genPhase < frameSize; genPhase += genSize) {
            for (chan = 0; chan < output.numberOfChannels; chan += 1) {
                input.generate(audioCtx.sampleRate, genSize, runIndex);
                generated = input.getChannelData(chan);
                output.copyToChannel(generated, chan, genPhase);
            }
            runIndex += genSize;
            if (that.runIndexUpdated) {
                that.runIndexUpdated(genSize);
            }
        }
    };

    return that;
}
