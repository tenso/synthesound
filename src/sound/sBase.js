/*jslint node: true */

/*global Float32Array*/
/*global util*/
/*global log*/

"use strict";

function sBase(sId) {
    var that = {},
        channels = 2,
        frameSize = 0,
        maxFrameSize = 0,
        sRate = 0,
        runIndex = 0,
        genIndex = -1,
        inputs = {
            inputs: []
        },
        chanUpdated,
        argsUpdated = false,
        data = {};

    function findInputIndex(comp, outType, inType) {
        var i,
            typeIn = inType || "inputs",
            typeOut = outType || "output";

        for (i = 0; i < inputs[typeIn].length; i += 1) {
            if (inputs[typeIn][i].comp === comp && inputs[typeIn][i].outType === typeOut) {
                return i;
            }
        }
        log.error("sBase:findInputIndex: did not find comp out:" + typeOut + " in:" + typeIn);
        return -1;
    }

    that.typeId = function () {
        return sId;
    };

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

    that.addInput = function (comp, outType, inType) {
        var typeOut = outType || "output",
            typeIn = inType || "inputs";

        if (!inputs.hasOwnProperty(typeIn)) {
            inputs[typeIn] = [];
        }

        inputs[typeIn].push({comp: comp, outType: typeOut});
        return that;
    };

    that.delInput = function (comp, outType, inType) {
        var typeIn = inType || "inputs",
            typeOut = outType || "output",
            index = findInputIndex(comp, typeOut, typeIn);

        if (index >= 0) {
            inputs[typeIn].splice(index, 1);
            if (inputs[typeIn].length === 0) {
                delete inputs[typeIn];
            }
        }
        return that;
    };

    that.generate = function (sampleRate, fSize, rIndex) {
        var chan,
            outType;

        if (genIndex === rIndex) {
            return that;
        }
        genIndex = rIndex;

        sRate = sampleRate;
        runIndex = rIndex;
        if (fSize > maxFrameSize) {
            maxFrameSize = fSize;

            //FIXME: not all need or want this
            that.genData = new Float32Array(maxFrameSize);

            for (outType in data) {
                if (data.hasOwnProperty(outType)) {
                    for (chan = 0; chan < channels; chan += 1) {
                        data[outType][chan] = new Float32Array(maxFrameSize);
                    }
                }
            }
        }
        frameSize = fSize;

        that.generateInputs();
        that.makeAudio();
        argsUpdated = false;

        if (chanUpdated) {
            for (chan = 0; chan < channels; chan += 1) {
                chanUpdated(chan, data.output[chan]);
            }
        }
        return that;
    };

    that.generateInputs = function () {
        var inputIndex,
            typeIn;

        for (typeIn in inputs) {
            if (inputs.hasOwnProperty(typeIn)) {
                for (inputIndex = 0; inputIndex < inputs[typeIn].length; inputIndex += 1) {
                    if (inputs[typeIn][inputIndex].comp.genIndex !== runIndex) {
                        inputs[typeIn][inputIndex].comp.generate(sRate, frameSize, runIndex);
                    }
                }
            }
        }

        return that;
    };

    that.setChannelDataZero = function (outType) {
        var chan,
            typeOut = outType || "output";

        for (chan = 0; chan < that.numChannels(); chan += 1) {
            data[typeOut][chan].fill(0);
        }
        return that;
    };

    that.getChannelData = function (chan, outType) {
        var typeOut = outType || "output";

        if (!data.hasOwnProperty(typeOut)) {
            log.error("sBase.getChannelData: no such outType:" + typeOut);
            return data.output[chan];
        }
        return data[typeOut][chan];
    };

    that.numInputs = function (inType) {
        var typeIn = inType || "inputs";
        if (!inputs.hasOwnProperty(typeIn)) {
            return 0;
        }
        return inputs[typeIn].length;
    };

    that.getInputChannelData = function (index, chan, inType) {
        var typeIn = inType || "inputs",
            input = inputs[typeIn][index];

        return input.comp.getChannelData(chan, input.outType);
    };

    that.argsUpdated = function () {
        return argsUpdated;
    };

    that.initArgs = function (args, userArgs, argsOff) {
        if (args) {
            that.args = args;
            that.setArgs(userArgs);
        }
        if (argsOff) {
            that.argsOff = argsOff;
        }
        return that;
    };

    that.getArgs = function () {
        return util.copyData(that.args);
    };

    that.getArgsOff = function () {
        return util.copyData(that.argsOff);
    };

    that.setArgs = function (args) {
        argsUpdated = util.setArgs(that.args, args);
        return that;
    };

    that.addOutput = function (outType) {
        var typeOut = outType || "output";

        if (data.hasOwnProperty(typeOut)) {
            log.error("sBase.addOutput: already have output:" + typeOut);
        } else {
            data[typeOut] = [];
        }
        return that;
    };

    that.typeClass = "sBase";
    that.typeIs = sId || "sBase";
    that.addOutput();

    //FIXME: make private or move to needed
    that.args = {};
    that.argsOff = {};
    that.genData = undefined;

    return that;
}
