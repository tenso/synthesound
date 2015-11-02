"use strict";

function wNewSin(audioCtx, args) {
    var node = audioCtx.createScriptProcessor(4096, 1, 1);
        
    node.runIndex = 0;
    node.onaudioprocess = function(audioEvent) {
        var index =0,
            i = 0,
            chan = 0,
            samplesDone = 0,
            data = null,
            buffer = audioEvent.outputBuffer;
    
        buffer.normalize = false;
        
        for (chan = 0; chan < buffer.numberOfChannels; chan += 1) {
            data = buffer.getChannelData(chan);
            samplesDone = data.length;
            for (i = 0; i < data.length; i += 1) {
                index = (node.runIndex + i) % buffer.sampleRate;
                data[i] = node.amp * Math.sin(2 * Math.PI * node.freq * index / buffer.sampleRate);
            }
        }
        node.runIndex += samplesDone;
    }
    node.setArgs = function(args) {
        node.amp = args.amp || 0.10;
        node.freq = args.freq || 220;
        node.phase = args.phase || 0;    
    }
    node.setArgs(args);
    
    return node;
}