"use strict";
/*global log*/
/*global test*/
/*global sCIO*/
/*global menubar*/
/*global URL*/
/*global FileReader*/
/*global workspace*/
/*global guiInput*/
/*global gui*/
/*global lang*/
/*global gBase*/
/*global workbar*/
/*global window*/
/*global document*/
/*global util*/

var app = {
    ver: "1.0",

    screen: {
        minX: 0,
        minY: 24, /*dont allow stuff behind topmenu*/
        maxX: undefined,
        maxY: undefined
    }
};

var globalDebug = {
    setNote: undefined
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
        helpText: "Global:\n" +
                "Space: play/pause\n" +
                "\n" +
                "Tracker:\n" +
                "Ctrl-left-click to move current time n\n" +
                "Ctrl-a to select all states\n" +
                "Ctrl-c to copy selected states\n" +
                "right-drag to select states\n" +
                "left-drag to move selected states\n" +
                "Shift-left-drag to move end positions\n",
        save: "Save",
        load: "Load",
        help: "Help",
        about: "About",
        file: "File",
        stop: "Stop",
        rec: "Rec",
        log: "Log",
        info: "Info",
        process: "Process",
        processOn: "Process on",
        processOff: "Process off",
        detectedErrors: "Detected Errors",
        license: "Copyright 2015 Anton Olofsson\n" +
                "\n" +
                "This program is free software: you can redistribute it and/or modify\n" +
                "it under the terms of the GNU General Public License as published by\n" +
                "the Free Software Foundation, either version 3 of the License, or\n" +
                "(at your option) any later version.\n" +
                "\n" +
                "This program is distributed in the hope that it will be useful,\n" +
                "but WITHOUT ANY WARRANTY; without even the implied warranty of\n" +
                "MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n" +
                "GNU General Public License for more details.\n" +
                "\n" +
                "You should have received a copy of the GNU General Public License\n" +
                "along with this program.  If not, see <http://www.gnu.org/licenses/>.\n"
    });
    lang.setLanguage("en");
}

/*FIXME: should not be global!!*/
var audioWork, /*depends on it: sCOut, sCVKey */
    gIO;       /*depends on it: workspace, ioPort, sCBase*/

window.onload = function () {
    var appBody = document.getElementById("appBody"),
        topMenu,
        input,
        audioBar,
        guiApp = gBase().abs().w("100%").h("100%");

    initLanguage();

    appBody.appendChild(guiApp);

    /*testsuite*/
    test.runTests(true);

    audioWork = workspace();
    audioBar = workbar();

    audioBar.changeCurrentMs = audioWork.setCurrentMs;
    audioBar.changeTotalMs = audioWork.setTotalMs;
    audioBar.changeTimeParams = audioWork.setTimeParams;
    audioBar.changePlayback = audioWork.setPlayback;
    audioBar.changeRecord = audioWork.setRecord;
    audioBar.changeTopPosition = audioWork.setViewHeight;
    audioBar.changeSCompState = audioWork.modifySCompState;
    audioWork.timeUpdated = audioBar.setTime;
    audioWork.currentSCompUpdated = audioBar.setCurrentSComp;
    audioWork.timeParamsUpdated = audioBar.setTimeParams;
    audioWork.totalTimeUpdated = audioBar.setTotalTime;
    audioWork.playbackUpdated = audioBar.setPlayback;

    gIO = sCIO();
    topMenu = menubar(audioWork).move(0, 0);
    input = guiInput(audioWork, gIO.resizeCanvas); //resize is when scrollWidth/scrollHeigth changes
    gui.setInputHandler(input);

    guiApp.add(topMenu);
    guiApp.add(audioWork);
    audioWork.add(gIO);
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
    if (!test.verifyFunctionality(FileReader, "FileReader")) {
        topMenu.logError("need FileReader");
    }

    if (audioWork.init()) {
        audioWork.onworkspacechanged = gIO.resizeCanvas; //update size of canvas on load
    } else {
        topMenu.logError("need AudioContext and Array.fill");
    }

    /*function confirmExit(e) {
        var returnValue = "confirm exit!";
        e.returnValue = returnValue;
        return returnValue;
    }
    window.addEventListener("beforeunload", confirmExit);*/
};
