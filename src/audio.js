/*jshint strict: true */

var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext(),
    channels = 2;

var genFreq = 220;
function setGenFreq(freq) {
    "use strict";
    genFreq = freq;
}
function getGenFreq() {
    "use strict";
    return genFreq;
}

function playAudio(freq) {
    "use strict";
    var frames = context.sampleRate * 2,
        buffer = context.createBuffer(channels, frames, context.sampleRate);
    
    for (var chan=0; chan < channels;chan++) {
        var chanBuff = buffer.getChannelData(chan);
        var amp=0.5;
        for (var sample=0; sample < frames; sample++) {
            chanBuff[sample] = amp*Math.sin(2*Math.PI*freq*sample/context.sampleRate);
        }
    }
    
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
}