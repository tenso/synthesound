"use strict";
/*global Float32Array*/
/*global Map*/

var extend = function (base, obj) {
    obj.prototype = Object.create(base.prototype);
    obj.prototype.constructor = obj;
};

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
    this.specialInput = {};
    
    this.chanUpdated = null;
}

SBase.prototype.addInput = function (input, type) {
    if (!type) {
        this.inputs.push(input);
    } else {
        this.setSpecialInput(input, type);
    }
};

SBase.prototype.delInput = function (input, type) {
    if (!type) {
        var index = this.inputs.indexOf(input);
        if (index >= 0) {
            this.inputs.splice(index, 1);
        }
    } else {
        this.delSpecialInput(input, type);
    }
};

SBase.prototype.setSpecialInput = function (input, type) {
    this.specialInput[type] = input;
};

SBase.prototype.delSpecialInput = function (type) {
    delete this.specialInput[type];
};

SBase.prototype.haveSpecialInput = function (type) {
    return this.specialInput.hasOwnProperty(type);
};

SBase.prototype.getSpecialData = function (type) {
    return this.specialInput[type].data;
};

SBase.prototype.generateInputs = function () {
    var inputIndex,
        key;
    
    for (inputIndex = 0; inputIndex < this.inputs.length; inputIndex += 1) {
        if (this.inputs[inputIndex].genIndex !== this.runIndex) {
            this.inputs[inputIndex].generate(this.sampleRate, this.frameSize, this.runIndex);
        }
    }
    
    for (key in this.specialInput) {
        if (this.specialInput.hasOwnProperty(key)) {
            this.specialInput[key].generate(this.sampleRate, this.frameSize, this.runIndex);
        }
    }
};

SBase.prototype.getChannelData = function (chan) {
    return this.data[chan];
};
    
SBase.prototype.generate = function (sampleRate, frameSize, runIndex) {
    var chan,
        dataUpdatedEvent;
    
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

    this.generateInputs();
    this.makeAudio();
    
    if (this.chanUpdated) {
        for (chan = 0; chan < this.channels; chan += 1) {
            this.chanUpdated(chan, this.data[chan]);
        }
    }
};
