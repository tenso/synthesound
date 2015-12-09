"use strict";
/*global input*/
/*global audio*/
/*global test*/
/*global gIO*/
/*global URL*/

window.onload = function () {
    var freqSelect = document.getElementById("freqSelect");

    test.verifyFunctionality(Array.prototype.fill, "Array.fill");
    test.verifyFunctionality(URL.createObjectURL, "URL.createObjectURL");
    test.verifyFunctionality(URL.revokeObjectURL, "URL.revokeObjectURL");
    
    input.init();
    
    freqSelect.addEventListener("keydown", input.parseInputDown, false);
    freqSelect.addEventListener("keyup", input.parseInputUp, false);
                
    audio.startAudio();
                
    gIO.connectAll(document.getElementById("lines"));
    
    /*testsuite*/
    test.runTests();
};
