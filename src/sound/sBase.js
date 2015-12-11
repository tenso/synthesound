"use strict";
/*global Float32Array*/
/*global Map*/

function sBase(sId) {
    var that = {},
        channels = 2,
        frameSize = 0,
        maxFrameSize = 0,
        sRate = 0,
        runIndex = 0,
        genIndex = -1,
        inputs = [],
        specialInput = {},
        chanUpdated;
    
    that.title = function () {
        return sId;
    };
    
    //FIXME: make private?
    that.data = [];
    that.genData = undefined;
    
    that.setChanUpdatedCallback = function (cb) {
        chanUpdated = cb;
        return that;
    };
    
    that.sampleRate = function () {
        return sRate;
    };
        
    that.numChannels = function () {
        return channels;
    };
    
    that.wantedSamples = function () {
        return frameSize;
    };
    
    that.addInput = function (input, type) {
        if (!type) {
            inputs.push(input);
        } else {
            that.setSpecialInput(input, type);
        }
        return that;
    };

    that.delInput = function (input, type) {
        if (!type) {
            var index = inputs.indexOf(input);
            if (index >= 0) {
                inputs.splice(index, 1);
            }
        } else {
            that.delSpecialInput(type);
        }
        return that;
    };

    that.setSpecialInput = function (input, type) {
        specialInput[type] = input;
        return that;
    };

    that.delSpecialInput = function (type) {
        delete specialInput[type];
        return that;
    };

    that.haveSpecialInput = function (type) {
        return specialInput.hasOwnProperty(type);
    };

    that.getSpecialChannelData = function (type, chan) {
        return specialInput[type].getChannelData(chan);
    };

    that.generate = function (sampleRate, fSize, rIndex) {
        var chan,
            dataUpdatedEvent;

        if (genIndex === rIndex) {
            return that;
        }
        genIndex = rIndex;

        sRate = sampleRate;
        runIndex = rIndex;
        if (fSize > maxFrameSize) {
            maxFrameSize = fSize;

            that.genData = new Float32Array(maxFrameSize);

            for (chan = 0; chan < channels; chan += 1) {
                that.data[chan] = new Float32Array(maxFrameSize);
            }
        }
        frameSize = fSize;

        that.generateInputs();
        that.makeAudio();

        if (chanUpdated) {
            for (chan = 0; chan < channels; chan += 1) {
                chanUpdated(chan, that.data[chan]);
            }
        }
        return that;
    };
    
    that.generateInputs = function () {
        var inputIndex,
            key;

        for (inputIndex = 0; inputIndex < inputs.length; inputIndex += 1) {
            if (inputs[inputIndex].genIndex !== runIndex) {
                inputs[inputIndex].generate(sRate, frameSize, runIndex);
            }
        }

        for (key in specialInput) {
            if (specialInput.hasOwnProperty(key)) {
                specialInput[key].generate(sRate, frameSize, runIndex);
            }
        }
        return that;
    };

    that.setChannelDataZero = function () {
        var chan;
        
        for (chan = 0; chan < that.numChannels(); chan += 1) {
            that.data[chan].fill(0);
        }
        return that;
    };
    
    that.getChannelData = function (chan) {
        return that.data[chan];
    };

    that.numInputs = function () {
        return inputs.length;
    };
    
    that.getInputChannelData = function (index, chan) {
        return inputs[index].data[chan];
    };
    
    return that;
}