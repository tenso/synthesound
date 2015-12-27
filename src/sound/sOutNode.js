"use strict";

function sOutNode(audioCtx, channels, frameSize) {
    var that = audioCtx.createScriptProcessor(frameSize, 1, channels);
    
    that.setInput = function (input) {
        that.input = input;
    };
    
    that.frameSize = frameSize;
    that.runIndex = 0;
    that.input = null;
    that.sampleRate = audioCtx.sampleRate;
    that.channels = channels;
    that.runIndexUpdated = undefined;
    
    that.onaudioprocess = function (audioEvent) {
        var index = 0,
            chan = 0,
            inData,
            dataUpdatedEvent,
            buffer = audioEvent.outputBuffer;
    
        buffer.normalize = false;
        
        for (chan = 0; chan < buffer.numberOfChannels; chan += 1) {
            that.input.generate(audioCtx.sampleRate, that.frameSize, that.runIndex);
            inData = that.input.getChannelData(chan);
            buffer.copyToChannel(inData, chan);
        }
        that.runIndex += that.frameSize;
        
        if (that.runIndexUpdated) {
            that.runIndexUpdated(that.frameSize);
        }
    };
    
    return that;
}