"use strict";
/*global log*/
/*global test*/
/*global sCIO*/
/*global menuBar*/
/*global URL*/
/*global FileReader*/
/*global workspace*/
/*global guiInput*/
/*global gui*/
/*global tracker*/

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
        topMenu,
        input,
        track;

    function stepFrame(frames) {
        track.stepFrames(frames);
        topMenu.updateTime(track.timeString());
    }

    
    /*testsuite*/
    test.runTests();
    
    audioWork = workspace(freqSelect);
    gIO = sCIO(audioWork);
    input = guiInput(audioWork, gIO.resizeCanvas);
    gui.setInputHandler(input);
    
    topMenu = menuBar(freqSelect, audioWork).move(0, 0);
        
    if (!test.verifyFunctionality(URL.createObjectURL, "URL.createObjectURL")
            || !test.verifyFunctionality(URL.revokeObjectURL, "URL.revokeObjectURL")) {
        topMenu.logError("need URL");
    }
    
    if (!test.verifyFunctionality(FileReader, "FileReader")) {
        topMenu.logError("need FileReader");
    }
    
    if (audioWork.init()) {
        audioWork.onworkspacechanged = gIO.resizeCanvas; //update size of canvas on load
        window.addEventListener("resize", gIO.resizeCanvas); //update size of canvas on window-resize
        audioWork.play();
        
        track = tracker(audioWork.sampleRate());
        audioWork.setFrameTickCallback(stepFrame);
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
