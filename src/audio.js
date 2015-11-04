"use strict";
/*global sGen*/
/*global sMix*/

var generators = [],
    mixer;

function setGenFreq(freq) {
    if (generators.length === 0) {
        return false;
    }
    generators[0].setArgs({"freq" : freq});
    generators[1].setArgs({"freq" : freq / 2});
    generators[2].setArgs({"freq" : freq / 3});
        
    return true;
}

var AudioContext = window.AudioContext || window.webkitAudioContext;
AudioContext.prototype.sGen = function (args) { return sGen(this, args); };
AudioContext.prototype.sMix = function (args) { return sMix(this, args); };

var audioCtx = new AudioContext();
var audioRunning = false;

function startAudio(freq) {
    if (audioRunning) {
        return false;
    }
    
    mixer = audioCtx.sMix();
    
    generators[0] = audioCtx.sGen({"freq": 110, "amp": 0.5, "type": "square"});
    generators[0].connect(mixer);
    
    generators[1] = audioCtx.sGen({"freq": 220, "amp": 0.2, "type": "square"});
    generators[1].connect(mixer);
    
    generators[2] = audioCtx.sGen({"freq": 220, "amp": 0.2, "type": "square"});
    generators[2].connect(mixer);

    mixer.connect(audioCtx.destination);
    
    audioRunning = true;
    window.console.log("start playback, sample rate is:" + audioCtx.sampleRate);
    return true;
}

function stopAudio(freq) {
    if (!audioRunning) {
        return false;
    }
    audioRunning = false;

    mixer.disconnect(audioCtx.destination);
    return true;
}