/*jshint strict: true */

/*global SinGen*/

var genFreq = 220;
function setGenFreq(freq) {
    "use strict";
    genFreq = freq;
}
function getGenFreq() {
    "use strict";
    return genFreq;
}

var generators = [];

var AudioContext = window.AudioContext || window.webkitAudioContext,
    audioCtx = new AudioContext();

function startAudio(freq) {
    "use strict";
    
    generators[0] = new SinGen(audioCtx);
    generators[0].freq = 220;
    generators[1] = new SinGen(audioCtx);
    generators[1].freq = 439;
    generators[2] = new SinGen(audioCtx);
    generators[2].freq = 882;

    window.console.log("start playback, sample rate is:" + audioCtx.sampleRate);
}

function stopAudio(freq) {
    "use strict";
    var i = 0;
    for (i = 0; i < generators.length; i += 1) {
        generators[i].free();
    }
}