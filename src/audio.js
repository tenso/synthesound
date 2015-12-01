"use strict";
/*global log*/
/*global test*/

/*global sOutNode*/
/*global sGen*/
/*global sMix*/
/*global sAdsr*/
/*global sDelay*/

/*global gScope*/

/*global sCOut*/
/*global sCGen*/
/*global sCVKey*/

/*global note*/

var generators = [],
    mixer,
    mixerOut,
    adsr,
    delay,
    out,
    scope = [];

function setShape(type) {
    generators[0].type = type;
    generators[1].type = type;
    generators[2].type = type;
}

function keyDown(notePressed) {
    var freq = note.hz(notePressed);
    
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

function keyUp(notePressed) {
    if (adsr) {
        adsr.setActive(false);
    }
}

function drawScopes(chan, data) {
    scope[chan].drawGraph(data);
}

var AudioContext = window.AudioContext || window.webkitAudioContext;

test.verifyFunctionality(AudioContext, "AudioContext");
test.verifyFunctionality(Array.prototype.fill, "Array fill");

var audioCtx = new AudioContext();
var audioRunning = false;
var scout;

function initSComp() {
    var gen,
        key;
    
    scout = sCOut(document.getElementById("scout"));
    
    gen = sCGen(document.getElementById("scgen0"));
    gen = sCGen(document.getElementById("scgen1"));
    gen = sCGen(document.getElementById("scgen2"));
    
    key = sCVKey(document.getElementById("scvkey"));
}

function startAudio(freq) {
    if (audioRunning) {
        return false;
    }
    
    initSComp();
    
    mixer = sMix();
    generators[0] = sGen({"freq": 220, "amp": 0.25, "type": "sine"});
    generators[1] = sGen({"freq": 220, "amp": 0.25, "type": "sine"});
    generators[2] = sGen({"freq": 110, "amp": 0.25, "type": "sine"});
    mixer.addInput(generators[0]);
    mixer.addInput(generators[1]);
    mixer.addInput(generators[2]);
    
    mixer.setChannelGain(0, 0.5);
    mixer.setChannelGain(1, 0.5);
    
    adsr = sAdsr({"a": 0.01, "d": 0.15, "s": 0.5, "r": 0.01});
    adsr.addInput(mixer);
    
    delay = sDelay();
    delay.setDelay(0.03);
    delay.setGain(0.7);
    
    mixerOut = sMix();
    mixerOut.addInput(adsr);
    
    mixerOut.addInput(delay);
    delay.addInput(mixerOut);
    
    mixerOut.addInput(scout.getOutput());
    
    //create actual output node:
    out = sOutNode(audioCtx, 2, 4096);
    out.setInput(mixerOut);
    out.connect(audioCtx.destination);
        
    scope[0] = gScope(document.getElementById("audioScopeL"), 0);
    scope[1] = gScope(document.getElementById("audioScopeR"), 1);
    mixerOut.setChanUpdatedCallback(function (chan, data) { drawScopes(chan, data); });
    
    audioRunning = true;
    log.info("start playback, sample rate:" + out.sampleRate + " channels " + out.channels);
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