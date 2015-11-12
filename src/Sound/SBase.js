"use strict";
/*global Float32Array*/
var frameSize = 4096;

var extend = function (base, obj) {
    obj.prototype = Object.create(base.prototype);
    obj.prototype.constructor = obj;
};

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
            node.input.generate(audioCtx.sampleRate, frameSize, node.runIndex);
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
    this.genData = null;
    this.sampleRate = 0;
    this.runIndex = 0;
    this.genIndex = -1;
    this.inputs = [];
}

SBase.prototype.addInput = function (input) {
    this.inputs.push(input);
};

SBase.prototype.generateInputs = function () {
    var inputIndex;
    for (inputIndex = 0; inputIndex < this.inputs.length; inputIndex += 1) {
        if (this.inputs.genIndex !== this.runIndex) {
            this.inputs[inputIndex].generate(this.sampleRate, this.frameSize, this.runIndex);
        }
    }
};

SBase.prototype.getChannelData = function (chan) {
    return this.data[chan];
};
    
SBase.prototype.generate = function (sampleRate, frameSize, runIndex) {
    var chan;
    
    if (this.genIndex === runIndex) {
        return;
    }
    this.genIndex = runIndex;
    
    this.sampleRate = sampleRate;
    this.runIndex = runIndex;
    if (frameSize > this.maxFrameSize) {
        this.maxFrameSize = frameSize;
        
        this.genData = new Float32Array(this.maxFrameSize);
        
        for (chan = 0; chan < this.channels; chan += 1) {
            this.data[chan] = new Float32Array(this.maxFrameSize);
        }
    }
    this.frameSize = frameSize;

    this.makeAudio();
    
};
