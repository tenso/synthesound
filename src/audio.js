"use strict";
/*global sOutNode*/
/*global SGen*/
/*global SMix*/
/*global SAdsr*/
/*global SDelay*/
/*global logInfo*/
/*global logError*/

var type = "sine",
    generators = [],
    mixer,
    mixerOut,
    adsr,
    delay,
    out;

function changeType() {
    if (type === "sine") {
        type = "square";
    } else {
        type = "sine";
    }
    generators[0].type = type;
    generators[1].type = type;
    generators[2].type = type;
}

function keyDown(freq) {
    if (generators.length === 0) {
        return false;
    }
    generators[0].freq = freq;
    generators[1].freq = freq * 2;
    generators[2].freq = freq * 4;
    
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

if (!AudioContext) {
    logError("no audiocontext, please use modern browser");
}

var audioCtx = new AudioContext();
var audioRunning = false;

function startAudio(freq) {
    if (audioRunning) {
        return false;
    }
    mixer = new SMix();
    generators[0] = new SGen({"freq": 220, "amp": 0.25, "type": type});
    generators[1] = new SGen({"freq": 220, "amp": 0.25, "type": type});
    generators[2] = new SGen({"freq": 110, "amp": 0.25, "type": type});
    mixer.addInput(generators[0]);
    mixer.addInput(generators[1]);
    mixer.addInput(generators[2]);
    mixer.setGain(0.5);
    
    adsr = new SAdsr({"a": 0.1, "d": 0.15, "s": 0.5, "r": 1.05});

    adsr.addInput(mixer);
    
    delay = new SDelay();
    delay.setDelay(0.3);
    delay.setGain(0.7);
                
    mixerOut = new SMix();
    mixerOut.addInput(adsr);
    mixerOut.addInput(delay);
    
    delay.addInput(mixerOut);
    
    out = sOutNode(audioCtx);
    out.setInput(mixerOut);
    out.connect(audioCtx.destination);
    
    audioRunning = true;
    logInfo("start playback, sample rate is:" + audioCtx.sampleRate);
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