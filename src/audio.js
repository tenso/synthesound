"use strict";
/*global sOutNode*/
/*global SGen*/
/*global SMix*/

var generators = [],
    mixer,
    out;

function setGenFreq(freq) {
    if (generators.length === 0) {
        return false;
    }
    generators[0].setArgs({"freq" : freq});
        
    return true;
}

var AudioContext = window.AudioContext || window.webkitAudioContext;

var audioCtx = new AudioContext();
var audioRunning = false;

function startAudio(freq) {
    if (audioRunning) {
        return false;
    }
        
    generators[0] = new SGen({"freq": 220, "amp": 0.5, "type": "square"});
    
    out = sOutNode(audioCtx);
    
    out.setInput(generators[0]);
    out.connect(audioCtx.destination);
    
    audioRunning = true;
    window.console.log("start playback, sample rate is:" + audioCtx.sampleRate);
    return true;
}

function stopAudio(freq) {
    if (!audioRunning) {
        return false;
    }
    audioRunning = false;

    out.disconnect(audioCtx.destination);
    return true;
}