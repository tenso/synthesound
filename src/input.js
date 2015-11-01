/*jshint strict: true */
/*global getGenFreq */
/*global setGenFreq */
/*global startAudio */
/*global stopAudio */

function parseInput(e) {
    "use strict";
    setGenFreq(e.target.value);
}

window.onload = function () {
    "use strict";
    var freqSelect = document.getElementById("freqSelect"),
        playButton = document.getElementById("play"),
        stopButton = document.getElementById("stop");
    
    freqSelect.defaultValue = getGenFreq();
    freqSelect.onchange = parseInput;
    freqSelect.addEventListener("keyup", parseInput, false);
    playButton.addEventListener("click", function () { startAudio(); }, false);
    stopButton.addEventListener("click", function () { stopAudio(); }, false);
};