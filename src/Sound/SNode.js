"use strict";

function sOutNode(audioCtx, channels, frameSize) {
    var node = audioCtx.createScriptProcessor(frameSize, 1, channels);
    node.frameSize = frameSize;
    node.runIndex = 0;
    node.input = null;
    node.sampleRate = audioCtx.sampleRate;
    node.channels = channels;
    
    node.onaudioprocess = function (audioEvent) {
        var index = 0,
            chan = 0,
            inData,
            dataUpdatedEvent,
            buffer = audioEvent.outputBuffer;
    
        buffer.normalize = false;
        
        for (chan = 0; chan < buffer.numberOfChannels; chan += 1) {
            node.input.generate(audioCtx.sampleRate, node.frameSize, node.runIndex);
            inData = node.input.getChannelData(chan);
            buffer.copyToChannel(inData, chan);
        }
        node.runIndex += node.frameSize;
    };
    
    node.setInput = function (input) {
        node.input = input;
    };
        
    return node;
}