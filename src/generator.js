"use strict";
class Generator {
    constructor(context) {
        this.amp = 0.25;
        this.freq = 220;
        this.phase = 0;
        this.audioCtx = context;
        this.globalIndex = 0;
        this.scriptNode = this.audioCtx.createScriptProcessor(4096, 1, 1);
        this.scriptNode.onaudioprocess = function(owner) {
            return function(event) {owner.generate(event)}
        }(this);
        this.scriptNode.connect(this.audioCtx.destination);
    }
    free() {
        this.scriptNode.disconnect(this.audioCtx.destination);
    }
    generate(audioEvent) {
    }
}

class SinGen extends Generator {
    generate(audioEvent) {
        var index =0,
            i = 0,
            chan = 0,
            samplesDone = 0,
            data = null,
            buffer = audioEvent.outputBuffer;
        
        for (chan = 0; chan < buffer.numberOfChannels; chan += 1) {
            data = buffer.getChannelData(chan);
            samplesDone = data.length;
            for (i = 0; i < data.length; i += 1) {
                index = (this.globalIndex + i) % buffer.sampleRate;
                data[i] = this.amp * Math.sin(2 * Math.PI * this.freq * index / buffer.sampleRate);
            }
        }
        this.globalIndex += samplesDone;
    }
}