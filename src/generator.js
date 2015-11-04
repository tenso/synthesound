"use strict";

var frameSize = 4096;

/*this is createOscillator */
function sGen(audioCtx, args) {
    var node = audioCtx.createScriptProcessor(frameSize, 1, 1);
    node.runIndex = 0;
    node.amp = 0.1;
    node.phase = 0;
    node.freq = 220;
    node.type = "sine";
    
    node.onaudioprocess = function (audioEvent) {
        var index = 0,
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
                index = (node.runIndex + i);
                if (node.type === "sine") {
                    data[i] = node.amp * Math.sin(2 * Math.PI * node.freq * index / buffer.sampleRate);
                } else if (node.type === "square") {
                    var period = buffer.sampleRate / (2.0 * node.freq);
                    var inPeriod = index % period;
                    data[i] = node.amp * (inPeriod < (period / 2.0) ? 1.0 : -1.0);
                }
            }
        }
        node.runIndex += samplesDone;
    };
    
    node.setArgs = function (args) {
        node.amp = args.amp || node.amp;
        node.freq = args.freq || node.freq;
        node.phase = args.phase || node.phase;
        node.type = args.type || node.type;
    };
    
    node.setArgs(args);
    
    return node;
}

/* This could be a createGain()...*/
function sMix(audioCtx, args) {
    var node = audioCtx.createScriptProcessor(frameSize, 1, 1),
        input,
        output,
        chan,
        inData,
        i;
    
    node.onaudioprocess = function (audioEvent) {
        input = audioEvent.inputBuffer;
        output = audioEvent.outputBuffer;
        output.normalize = false;
        
        for (chan = 0; chan < input.numberOfChannels; chan += 1) {
            inData = input.getChannelData(chan);
            output.copyToChannel(inData, chan);
        }
    };
    return node;
}