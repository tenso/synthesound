/*jshint strict: true */

/*global SinGen*/

function setGenFreq(freq) {
    "use strict";
    generators[0].setArgs({"freq" : freq});
    generators[1].setArgs({"freq" : freq*2});
}

var generators = [];

var AudioContext = window.AudioContext || window.webkitAudioContext;
AudioContext.prototype.wSinGen = function(args) { return wNewSin(this, args); }

var audioCtx = new AudioContext();
var audioRunning = false;

function startAudio(freq) {
    "use strict";
    if (audioRunning) {
        return false;
    }
    audioRunning = true;
    generators[0] = audioCtx.wSinGen({"freq": 220, "amp": 0.1});
    generators[0].connect(audioCtx.destination);
    
    generators[1] = audioCtx.wSinGen({"freq": 110, "amp": 0.1});
    generators[1].connect(audioCtx.destination);

    window.console.log("start playback, sample rate is:" + audioCtx.sampleRate);
    return true;
}

function stopAudio(freq) {
    "use strict";
    if (!audioRunning) {
        return false;
    }
    audioRunning = false;
    var i = 0;
    for (i = 0; i < generators.length; i += 1) {
        generators[i].disconnect(audioCtx.destination);
    }
    return true;
}