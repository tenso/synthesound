"use strict";
/*global input*/
/*global audio*/
/*global test*/
/*global gIO*/
/*global sCMenuBar*/

/*global URL*/

window.onload = function () {
    var freqSelect = document.getElementById("freqSelect"),
        workspace = document.getElementById("workspace"),
        menuBar;
            
    input.init();
    
    menuBar = sCMenuBar(workspace).move(0, 0);
    
    if (!test.verifyFunctionality(URL.createObjectURL, "URL.createObjectURL")
            || !test.verifyFunctionality(URL.revokeObjectURL, "URL.revokeObjectURL")) {
        menuBar.logError("need URL");
    }
    
    freqSelect.addEventListener("keydown", input.parseInputDown, false);
    freqSelect.addEventListener("keyup", input.parseInputUp, false);

    if (test.verifyFunctionality(audio.AudioContext, "audio.AudioContext")
            && test.verifyFunctionality(Array.prototype.fill, "Array.fill")) {
        audio.startAudio();
        gIO.connectAll(document.getElementById("lines"));
    } else {
        menuBar.logError("need AudioContext and Array.fill");
    }
    
    /*testsuite*/
    test.runTests();
};
