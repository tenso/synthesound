"use strict";
/*global input*/
/*global log*/
/*global test*/
/*global sCIO*/
/*global menuBar*/
/*global URL*/
/*global FileReader*/
/*global workspace*/

var app = {
    ver: "1.0",
    
    screen: {
        minX: 0,
        minY: 32, /*dont allow stuff behind topmenu*/
        maxX: undefined,
        maxY: undefined
    }
};

/*FIXME: should not be global!!*/
var audioWork, /*depends on it: sCOut, sCVKey */
    gIO;       /*depends on it: workspace, ioPort, sCBase, gWidget*/

window.onload = function () {
    var freqSelect = document.getElementById("freqSelect"),
        topMenu;
    
    audioWork = workspace(freqSelect);
    gIO = sCIO(audioWork);
    
    /*testsuite*/
    test.runTests();
    
    input.init(audioWork, gIO.resizeCanvas); //update size of canvas on workspace grow
    
    topMenu = menuBar(freqSelect, audioWork).move(0, 0);
    
    if (!test.verifyFunctionality(URL.createObjectURL, "URL.createObjectURL")
            || !test.verifyFunctionality(URL.revokeObjectURL, "URL.revokeObjectURL")) {
        topMenu.logError("need URL");
    }
    
    if (!test.verifyFunctionality(FileReader, "FileReader")) {
        topMenu.logError("need FileReader");
    }
    
    freqSelect.addEventListener("keydown", input.parseInputDown, false);
    freqSelect.addEventListener("keyup", input.parseInputUp, false);

    if (audioWork.startAudio()) {
        audioWork.onworkspacechanged = gIO.resizeCanvas; //update size of canvas on load
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
