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

var graphData = new DelayBuffer(48000);

function redrawGraph(chan, newData) {
    var canvas = document.getElementById("audio-scope"),
        ctx = canvas.getContext("2d"),
        i = 0,
        x = 0,
        y = 0;
    
    if (chan !== 0) {
        return;
    }
    graphData.setArray(newData);
            
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.strokeStyle = "#484";
    ctx.beginPath();
    
    ctx.moveTo(0, canvas.height / 2 + (canvas.height / 2.0) * graphData.get(0));
    for (i = 1; i < graphData.length; i+=100) {
        x = canvas.width * i / graphData.length;
        y = canvas.height / 2 + (canvas.height / 2.0) * graphData.get(i);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
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
    delay.setDelay(0.03);
    delay.setGain(0.7);
                
    mixerOut = new SMix();
    mixerOut.addInput(adsr);
    mixerOut.addInput(delay);
    
    delay.addInput(mixerOut);
    
    out = sOutNode(audioCtx);
    out.refreshGraph = redrawGraph;
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