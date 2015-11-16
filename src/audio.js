"use strict";
/*global logInfo*/
/*global logError*/

/*global sOutNode*/
/*global SGen*/
/*global SMix*/
/*global SAdsr*/
/*global SDelay*/

/*global GScope*/

/*global noteHz*/

var type = "sine",
    generators = [],
    mixer,
    mixerOut,
    adsr,
    delay,
    out,
    scope = [];

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

function keyDown(note) {
    var freq = noteHz(note);
    
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

function keyUp(note) {
    if (adsr) {
        adsr.setActive(false);
    }
}

function setParam(param, val) {
    if (param === "a") {
        adsr.a = val;
    } else if (param === "d") {
        adsr.d = val;
    } else if (param === "s") {
        adsr.s = val;
    } else if (param === "r") {
        adsr.r = val;
    } else if (param === "L") {
        return mixerOut.setGain(0, val);
    } else if (param === "R") {
        return mixerOut.setGain(1, val);
    }
}
function getParam(param) {
    if (param === "a") {
        return adsr.a;
    } else if (param === "d") {
        return adsr.d;
    } else if (param === "s") {
        return adsr.s;
    } else if (param === "r") {
        return adsr.r;
    } else if (param === "L") {
        return mixerOut.gain[0];
    } else if (param === "R") {
        return mixerOut.gain[1];
    }
}

function drawScopes(chan, data) {
    //console.log(chan + " : " + data[0]);
    scope[chan].drawGraph(data);
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
    mixer.setGain(0, 0.5);
    mixer.setGain(1, 0.5);
    
    adsr = new SAdsr({"a": 0.01, "d": 0.15, "s": 0.0, "r": 0.01});

    adsr.addInput(mixer);
    
    delay = new SDelay();
    delay.setDelay(0.03);
    delay.setGain(0.7);
                
    mixerOut = new SMix();
    mixerOut.addInput(adsr);
    
    mixerOut.addInput(delay);
    delay.addInput(mixerOut);
    
    out = sOutNode(audioCtx, 2, 1024);
    out.setInput(mixerOut);
    out.connect(audioCtx.destination);
    
    scope[0] = new GScope(document.getElementById("audioScopeL"), 0);
    scope[1] = new GScope(document.getElementById("audioScopeR"), 1);
    mixerOut.chanUpdated = function (chan, data) { drawScopes(chan, data); };
    
    audioRunning = true;
    logInfo("start playback, sample rate:" + out.sampleRate + " channels " + out.channels);
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