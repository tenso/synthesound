/*jslint node: true */

/*global log*/
/*global test*/
/*global sCIO*/
/*global menubar*/
/*global URL*/
/*global FileReader*/
/*global workspace*/
/*global guiInput*/
/*global gui*/
/*global gBase*/
/*global workbar*/
/*global window*/
/*global document*/
/*global util*/
/*global sCGlobal*/
/*global appTexts*/
/*global net*/
/*global userData*/

"use strict";

var app = {
    ver: "1.1.1",
    fileVer: 1.0
};

var user = userData();

var globalDebug = {
    setNote: undefined
};

/*FIXME: should not be global!!*/
var gIO;       /*depends on it: workspace, ioPort, sCBase*/

window.onload = function () {
    var appBody = document.getElementById("appBody"),
        topMenu,
        input,
        audioWork,
        audioBar,
        guiApp = gBase().abs().w("100%").h("100%");

    appTexts.initLanguage();

    appBody.appendChild(guiApp);

    /*testsuite*/
    test.runTests(true);

    audioWork = workspace().y(24);
    audioBar = workbar();
    topMenu = menubar(audioWork, 24).moveTo(0, 0);
    gIO = sCIO().top(24);
    audioWork.on("scroll", gIO.scroll);
    audioWork.on("resize", gIO.resize);
    input = guiInput(audioWork);
    gui.setInputHandler(input);

    audioBar.on("changeCurrentMs", audioWork.setCurrentMs);
    audioBar.on("changeTotalMs", audioWork.setTotalMs);
    audioBar.on("changeTimeParams", audioWork.setTimeParams);
    audioBar.on("changePlayback", audioWork.setPlayback);
    audioBar.on("changeRecord", audioWork.setRecord);
    audioBar.on("changeTopPosition", audioWork.setViewHeight);
    audioBar.on("changeSCompState", audioWork.modifySCompState);
    audioBar.on("changeLoop", audioWork.setLoop);

    sCGlobal.on("currentUpdated", audioBar.setCurrentSComp);
    sCGlobal.on("currentUpdatedState", audioBar.currentSCompStateChanged);

    audioWork.on("timeUpdated", audioBar.setTime);
    audioWork.on("currentSCompUpdated", audioBar.setCurrentSComp);
    audioWork.on("timeParamsUpdated", audioBar.setTimeParams);
    audioWork.on("totalTimeUpdated", audioBar.setTotalTime);
    audioWork.on("playbackUpdated", audioBar.setPlayback);
    audioWork.on("loopUpdated", audioBar.setLoop);

    topMenu.on("processOn", audioWork.startAudio);
    topMenu.on("processOff", audioWork.stopAudio);

    guiApp.add(topMenu);
    guiApp.add(audioWork);
    guiApp.add(gIO);

    guiApp.add(audioBar);
    audioBar.resizeCanvas();
    audioBar.setDefaults();

    globalDebug.setNote = topMenu.setNote;

    //DEBUG:
    /*input.mouseOver = function (e, mouseCapturer) {
        util.unused(mouseCapturer);

        var eType = e.target.typeIs || "",
            eTypeClass = e.target.typeClass || "";

        topMenu.setNote(eType + " : " + eTypeClass);
    };*/

    if (!test.verifyFunctionality(URL.createObjectURL, "URL.createObjectURL")
            || !test.verifyFunctionality(URL.revokeObjectURL, "URL.revokeObjectURL")) {
        topMenu.logError("need URL");
    }

    //FIXME: does not work! If FileReader is not defined...
    //FIXME: remove all verifyFunc... use typeof ... !== "undefined"
    if (!test.verifyFunctionality(FileReader, "FileReader")) {
        topMenu.logError("need FileReader");
    }

    if (!audioWork.init()) {
        topMenu.logError("need AudioContext and Array.fill");
    }
    user.refresh();

    /*function confirmExit(e) {
        var returnValue = "confirm exit!";
        e.returnValue = returnValue;
        return returnValue;
    }
    window.addEventListener("beforeunload", confirmExit);*/
};
