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
/*global lang*/

var app = {
    ver: "1.0",
    
    screen: {
        minX: 0,
        minY: 32, /*dont allow stuff behind topmenu*/
        maxX: undefined,
        maxY: undefined
    }
};

function initLanguage() {
    lang.addLanguage("en", {
        sCAdsr: "Adsr",
        sCConst: "Value",
        sCDelay: "Delay",
        sCGen: "Gen",
        sCMix: "Mix",
        sCVKey: "Keyboard",
        sCOp: "Operator",
        sCNotePitch: "Note Pitch",
        sCOut: "Output",
        sCScope: "Scope",
        helpText: "Help...",
        save: "Save",
        load: "Load",
        help: "Help",
        about: "About",
        file: "File",
        stop: "Stop",
        detectedErrors: "Detected Errors"
    });
    lang.setLanguage("en");
}

/*FIXME: should not be global!!*/
var audioWork, /*depends on it: sCOut, sCVKey */
    gIO;       /*depends on it: workspace, ioPort, sCBase, gWidget*/

window.onload = function () {
    var freqSelect = document.getElementById("freqSelect"),
        topMenu,
        input;

    initLanguage();
    
    /*testsuite*/
    test.runTests();
    
    audioWork = workspace(freqSelect);
    gIO = sCIO(audioWork);
    input = guiInput(audioWork, gIO.resizeCanvas);
    gui.setInputHandler(input);
    
    topMenu = menuBar(freqSelect, audioWork).move(0, 0);
    
    /*DEBUG:
    input.mouseOver = function (e, mouseCapturer) {
        var eType = e.target.typeIs || "",
            mType = mouseCapturer ? (mouseCapturer.typeIs || "") : "";
        
        topMenu.setNote("e:" + eType + " cap:" + mType);
    };*/
    
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
