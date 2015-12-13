"use strict";
/*global input*/
/*global audio*/
/*global log*/
/*global test*/
/*global gIO*/
/*global menuBar*/
/*global URL*/
/*global FileReader*/

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
        topMenu;
    
    /*testsuite*/
    test.runTests();
    
    input.init(workspace, gIO.resizeCanvas); //update size of canvas on workspace grow
    
    topMenu = menuBar(freqSelect, workspace).move(0, 0);
    
    if (!test.verifyFunctionality(URL.createObjectURL, "URL.createObjectURL")
            || !test.verifyFunctionality(URL.revokeObjectURL, "URL.revokeObjectURL")) {
        topMenu.logError("need URL");
    }
    
    if (!test.verifyFunctionality(FileReader, "FileReader")) {
        topMenu.logError("need FileReader");
    }
    
    freqSelect.addEventListener("keydown", input.parseInputDown, false);
    freqSelect.addEventListener("keyup", input.parseInputUp, false);

    if (test.verifyFunctionality(audio.AudioContext, "audio.AudioContext")
            && test.verifyFunctionality(Array.prototype.fill, "Array.fill")) {
        audio.startAudio();
        audio.onworkspacechanged = gIO.resizeCanvas; //update size of canvas on load
        gIO.init(document.getElementById("lines"));
        window.addEventListener("resize", gIO.resizeCanvas); //update size of canvas on window-resize
    } else {
        topMenu.logError("need AudioContext and Array.fill");
    }
        
    function confirmExit(e) {
        /*var returnValue = "confirm exit!";
        e.returnValue = returnValue;
        return returnValue;*/
    }
    
    window.addEventListener("beforeunload", confirmExit);
};
