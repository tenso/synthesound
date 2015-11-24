"use strict";
/*global Log*/
/*global Test*/

/*global sOutNode*/
/*global SGen*/
/*global SMix*/
/*global SAdsr*/
/*global SDelay*/

/*global GScope*/

/*global SCOut*/
/*global SCGen*/
/*global SCVKey*/

/*global Note*/

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

function keyDown(note) {
    var freq = Note.hz(note);
    
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
    } else if (param === "Dt") {
        delay.setDelay(val);
    } else if (param === "Dg") {
        delay.setGain(val);
    } else if (param === "shape") {
        setShape(val);
    } else if (param === "osc0") {
        
        generators[0].isOn = val;
    } else if (param === "osc1") {
        generators[1].isOn = val;
    } else if (param === "osc2") {
        generators[2].isOn = val;
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
    } else if (param === "Dt") {
        return delay.delay;
    } else if (param === "Dg") {
        return delay.gain;
    } else if (param === "shape") {
        return generators[0].type;
    } else if (param === "osc0") {
        return generators[0].isOn;
    } else if (param === "osc1") {
        return generators[1].isOn;
    } else if (param === "osc2") {
        return generators[2].isOn;
    }
}

function drawScopes(chan, data) {
    //console.log(chan + " : " + data[0]);
    scope[chan].drawGraph(data);
}

var AudioContext = window.AudioContext || window.webkitAudioContext;

Test.verifyFunctionality(AudioContext, "AudioContext");
Test.verifyFunctionality(Array.prototype.fill, "Array fill");

var audioCtx = new AudioContext();
var audioRunning = false;
var scout;

function initSComp() {
    var gen,
        key;
    
    scout = new SCOut(document.getElementById("scout"));
    
    gen = new SCGen(document.getElementById("scgen0"));
    gen = new SCGen(document.getElementById("scgen1"));
    gen = new SCGen(document.getElementById("scgen2"));
    
    key = new SCVKey(document.getElementById("scvkey"));
}

function startAudio(freq) {
    if (audioRunning) {
        return false;
    }
    
    initSComp();
    
    mixer = new SMix();
    generators[0] = new SGen({"freq": 220, "amp": 0.25, "type": "sine"});
    generators[1] = new SGen({"freq": 220, "amp": 0.25, "type": "sine"});
    generators[2] = new SGen({"freq": 110, "amp": 0.25, "type": "sine"});
    mixer.addInput(generators[0]);
    mixer.addInput(generators[1]);
    mixer.addInput(generators[2]);
    
    mixer.setGain(0, 0.5);
    mixer.setGain(1, 0.5);
    
    adsr = new SAdsr({"a": 0.01, "d": 0.15, "s": 0.5, "r": 0.01});
    
    adsr.addInput(mixer);
    
    delay = new SDelay();
    delay.setDelay(0.03);
    delay.setGain(0.7);
    
    mixerOut = new SMix();
    mixerOut.addInput(adsr);
    
    mixerOut.addInput(delay);
    delay.addInput(mixerOut);
    
    out = sOutNode(audioCtx, 2, 4096);
    out.setInput(mixerOut);
    out.connect(audioCtx.destination);
    
    mixerOut.addInput(scout.mix);
    
    scope[0] = new GScope(document.getElementById("audioScopeL"), 0);
    scope[1] = new GScope(document.getElementById("audioScopeR"), 1);
    mixerOut.chanUpdated = function (chan, data) { drawScopes(chan, data); };
    
    audioRunning = true;
    Log.info("start playback, sample rate:" + out.sampleRate + " channels " + out.channels);
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