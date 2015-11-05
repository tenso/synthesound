"use strict";
/*global Float32Array*/
var frameSize = 4096;

function sOutNode(audioCtx) {
    var node = audioCtx.createScriptProcessor(frameSize, 1, 1);
    node.runIndex = 0;
    node.input = null;
    
    node.onaudioprocess = function (audioEvent) {
        var index = 0,
            chan = 0,
            inData,
            buffer = audioEvent.outputBuffer;
    
        buffer.normalize = false;
        
        for (chan = 0; chan < buffer.numberOfChannels; chan += 1) {
            node.input.generate(audioCtx.sampleRate, frameSize);
            inData = node.input.getChannelData(chan);
            buffer.copyToChannel(inData, chan);
        }
        node.runIndex += frameSize;
    };
    
    node.setInput = function (input) {
        node.input = input;
    };
    return node;
}

function SBase() {
    this.channels = 2;
    this.frameSize = 0;
    this.maxFrameSize = 0;
    this.data = [];
    this.sampleRate = 0;
    this.runIndex = 0;
    
    this.getChannelData = function (chan) {
        return this.data[chan];
    };
    
    this.generate = function (sampleRate, frameSize) {
        var chan;
        this.sampleRate = sampleRate;
        if (frameSize > this.maxFrameSize) {
            this.maxFrameSize = frameSize * 2;
            window.console.log("change framesize to:" + frameSize);
            for (chan = 0; chan < this.channels; chan += 1) {
                this.data[chan] = new Float32Array(this.maxFrameSize);
            }
        }
        this.frameSize = frameSize;
        
        this.makeAudio();
        this.runIndex += this.frameSize;
    };
}

function SGen(args) {
    
    this.amp = 0.1;
    this.phase = 0;
    this.freq = 220;
    this.type = "sine";
            
    this.makeAudio = function () {
        var index = 0,
            i = 0,
            chan = 0,
            chanData,
            period,
            inPeriod;
        
        for (chan = 0; chan < this.channels; chan += 1) {
            chanData = this.data[chan];
            
            for (i = 0; i < chanData.length; i += 1) {
                index = (this.runIndex + i);
                
                if (this.type === "sine") {
                    chanData[i] = this.amp * Math.sin(2 * Math.PI * this.freq * index / this.sampleRate);
                } else if (this.type === "square") {
                    period = this.sampleRate / (2.0 * this.freq);
                    inPeriod = index % period;
                    chanData[i] = this.amp * (inPeriod < (period / 2.0) ? 1.0 : -1.0);
                }
            }
        }
    };
    
    this.setArgs = function (args) {
        this.amp = args.amp || this.amp;
        this.freq = args.freq || this.freq;
        this.phase = args.phase || this.phase;
        this.type = args.type || this.type;
    };
    this.setArgs(args);
}
SGen.prototype = new SBase();
SGen.prototype.constructor = SGen;
