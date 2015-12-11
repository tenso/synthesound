"use strict";
/*global input*/
/*global audio*/
/*global test*/
/*global gIO*/
/*global sCMenuBar*/
/*global URL*/

var app = {
    ver: "1.0",
    screen: {
        minX: 0,
        minY: 32, /*dont allow stuff behind topmenu*/
        maxX: undefined,
        maxY: undefined
    }
};

window.onload = function () {
    var freqSelect = document.getElementById("freqSelect"),
        workspace = document.getElementById("workspace"),
        menuBar;
    
    /*testsuite*/
    test.runTests();
    
    input.init();
    
    menuBar = sCMenuBar(freqSelect, workspace).move(0, 0);
    
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
};
