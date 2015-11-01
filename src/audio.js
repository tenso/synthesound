/*jshint strict: true */

var genFreq = 220;
function setGenFreq(freq) {
    "use strict";
    genFreq = freq;
}
function getGenFreq() {
    "use strict";
    return genFreq;
}

var globalIndex = 0;
function generateAudio(event) {
    "use strict";
    var outputBuffer = event.outputBuffer,
        chan = 0,
        amp = 0.5,
        sample = 0,
        outputData = null,
        index = 0;
    
    for (chan = 0; chan < outputBuffer.numberOfChannels; chan += 1) {
        outputData = outputBuffer.getChannelData(chan);

        for (sample = 0; sample < outputBuffer.length; sample += 1) {
            index = (globalIndex + sample) % outputBuffer.sampleRate;
            outputData[sample] = amp * Math.sin(2 * Math.PI * getGenFreq() * index / outputBuffer.sampleRate);
        }
    }
    globalIndex += outputBuffer.length;
}

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext(),
    channels = 2,
    scriptNode = audioCtx.createScriptProcessor(4096, 1, 1);

scriptNode.onaudioprocess = generateAudio;

function startAudio(freq) {
    "use strict";
    scriptNode.connect(audioCtx.destination);
}

function stopAudio(freq) {
    "use strict";
    scriptNode.disconnect(audioCtx.destination);
}