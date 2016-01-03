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
/*global gBase*/
/*global workbar*/
/*global window*/
/*global document*/

var app = {
    ver: "1.0",

    screen: {
        minX: 0,
        minY: 32, /*dont allow stuff behind topmenu*/
        maxX: undefined,
        maxY: undefined,
        maxBottom: 32
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
        log: "Log",
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
    gIO;       /*depends on it: workspace, ioPort, sCBase, gWidget*/

window.onload = function () {
    var appBody = document.getElementById("appBody"),
        topMenu,
        input,
        guiApp = gBase();

    initLanguage();

    appBody.appendChild(guiApp);

    /*testsuite*/
    test.runTests(true);

    audioWork = workspace();
    gIO = sCIO(audioWork);
    input = guiInput(audioWork, gIO.resizeCanvas);
    gui.setInputHandler(input);

    //FIXME: awkward init and object inter-dependency!
    topMenu = menuBar(guiApp, audioWork).move(0, 0);
    guiApp.appendChild(audioWork);
    workbar(guiApp, audioWork);

    //DEBUG:
    input.mouseOver = function (e) {
        var eType = e.target.typeIs || "",
            eTypeClass = e.target.typeClass || "";

        topMenu.setNote(eType + " : " + eTypeClass);
    };

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
        window.addEventListener("resize", gIO.resizeCanvas); //update size of canvas on window-resize
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
