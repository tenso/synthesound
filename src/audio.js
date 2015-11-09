"use strict";
/*global sOutNode*/
/*global SGen*/
/*global SMix*/
/*global SAdsr*/

var generators = [],
    mixer,
    adsr,
    out;

function keyDown(freq) {
    if (generators.length === 0) {
        return false;
    }
    generators[0].setArgs({"freq" : freq});
    generators[1].setArgs({"freq" : freq*2});
    generators[2].setArgs({"freq" : freq/2});
    adsr.setActive(false);
    adsr.setActive(true);
    return true;
}

function keyUp(freq) {
    if (adsr) {
        adsr.setActive(false);
    }
}

var AudioContext = window.AudioContext || window.webkitAudioContext;

var audioCtx = new AudioContext();
var audioRunning = false;

function startAudio(freq) {
    if (audioRunning) {
        return false;
    }
    mixer = new SMix();
    generators[0] = new SGen({"freq": 220, "amp": 0.25, "type": "square"});
    generators[1] = new SGen({"freq": 110, "amp": 0.25, "type": "square"});
    generators[2] = new SGen({"freq": 110, "amp": 0.25, "type": "square"});
    mixer.addInput(generators[0]);
    mixer.addInput(generators[1]);
    mixer.addInput(generators[2]);
    
    adsr = new SAdsr({"a": 0.01, "d": 0.5, "s": 0.25, "r": 1});

    adsr.addInput(mixer);
    
    out = sOutNode(audioCtx);
    out.setInput(adsr);
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