"use strict";
/*global input*/
/*global audio*/
/*global test*/
/*global gIO*/

window.onload = function () {
    var freqSelect = document.getElementById("freqSelect"),
        playButton = document.getElementById("play"),
        stopButton = document.getElementById("stop");

    input.init();
    
    freqSelect.addEventListener("keydown", input.parseInputDown, false);
    freqSelect.addEventListener("keyup", input.parseInputUp, false);
    stopButton.addEventListener("click", function () { audio.stopAudio(); }, false);
                
    audio.startAudio();
                
    gIO.connectAll(document.getElementById("lines"));
    
    /*testsuite*/
    test.runTests();
};
