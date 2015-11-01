/*jshint strict: true */

function parseKeyUp(e) {
    "use strict";
    setGenFreq(e.target.value);
    if (e.keyCode === 13) {
        playAudio(getGenFreq());
    }
}

window.onload = function () {
    "use strict";
    var freqSelect = document.getElementById("freqSelect");
    if (!freqSelect) {
        window.alert("did not find id");
    }
    freqSelect.addEventListener("keyup", parseKeyUp, false);
    
    var playButton = document.getElementById("play");
    playButton.addEventListener("click", function() { playAudio(getGenFreq());}, false);
};