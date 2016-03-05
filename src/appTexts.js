/*jslint node: true*/
/*jslint es5: true*/

/*global lang*/

"use strict";

var appTexts = {
    changelog: {
        "1.1": {
            changes: [
                "Bugfixes",
                "Admin-work."
            ],
            date: "2016-03-05"
        },
        "1.0": {
            changes: [
                "Initial release."
            ],
            date: "2016-02-28"
        }
    },

    buildChangelog: function () {
        var ver,
            str = "",
            i;

        for (ver in appTexts.changelog) {
            if (appTexts.changelog.hasOwnProperty(ver)) {
                str += "<strong>" + ver + "</strong>" + "  " +
                    "<strong>" + appTexts.changelog[ver].date + "</strong>" + "\n";

                for (i = 0; i < appTexts.changelog[ver].changes.length; i += 1) {
                    str += appTexts.changelog[ver].changes[i] + "\n";
                }
                str += "\n";
            }
        }
        return str;
    },

    buildHelpText: function () {
        var helpText = "<table style='min-width:100%;'>";

        function addTitle(title) {
            helpText += "<tr colspan=100><td class=helpTitle>" + title + "</td></tr>";
        }
        function addCommand(cmd, text) {
            helpText += "<tr><td class=helpCmd>" + cmd + "</td><td class=helpText>" + text + "</td></tr>";
        }
        function addText(text) {
            helpText += "<tr colspan=100><td class=helpText>" + text + "</td></tr>";
        }
        //FIXME: translate!
        addTitle("Short introduction");
        addText("Right-click on the canvas to open the component menu.");
        addText("Release over component to add it to canvas.");
        addText("\n");
        addText("Select a component with left-click to edit its state");
        addText("in the tracker at the bottom of the screen.");
        addText("The <strong>Keyboard</strong> component has a piano-roll as its state.");
        addText("\n");
        addText("Add a component (say a <strong>Gen</strong>) to the <strong>Output</strong> component");
        addText("to add it to audio-output.");

        return helpText + "</table>";
    },

    buildKeysText: function () {
        var helpText = "<table style='min-width:100%;'>";

        function addTitle(title) {
            helpText += "<tr colspan=100><td class=helpTitle>" + title + "</td></tr>";
        }
        function addCommand(cmd, text) {
            helpText += "<tr><td class=helpCmd>" + cmd + "</td><td class=helpText>" + text + "</td></tr>";
        }
        function addText(text) {
            helpText += "<tr colspan=100><td class=helpText>" + text + "</td></tr>";
        }
        //FIXME: translate!
        addTitle("Playback");
        addCommand("space", "play/pause");
        addText("\n");

        addTitle("Canvas");
        addCommand("rightclick", "open component menu");
        addCommand("leftdrag from IO-ports", "make connections");
        addCommand("rightclick on IO-ports", "remove connections");
        addText("\n");

        addTitle("Tracker states");
        addCommand("leftdrag", "add new state on release");
        addCommand("rightdrag", "select states");
        addCommand("shift-rightdrag", "add or remove from selection");
        addCommand("leftdrag", "move start of selected states");
        addCommand("shift-left-drag", "move end positions of selected states");
        addCommand("ctrl-a", "select all states");
        addCommand("ctrl-c", "make a copy of selected states over old ones (need to be moved manually)");
        addText("\n");

        addTitle("Tracker quantization");
        addText("Quantization is toggled by pressing the \"1\" button in the tracker.");
        addText("\n");

        addTitle("Tracker time and loop control");
        addCommand("ctrl-leftclick", "move current time");
        addCommand("ctrl-shift-leftdrag", "move loop start");
        addCommand("ctrl-shift-rightdrag", "move loop end");
        addText("\n");

        addTitle("Tracker zoom");
        addCommand("ctrl-scrollwheel", "zoom y");
        addCommand("ctrl-shift-scrollwheel", "zoom x");
        addText("\n");

        return helpText + "</table>";
    },

    buildLicenseText: function () {
        return "Copyright 2015 Anton Olofsson\n" +
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
                "along with this program.  If not, see <http://www.gnu.org/licenses/>.\n";
    },

    initLanguage: function () {
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
            save: "Save",
            load: "Load",
            help: "Help",
            about: "About",
            file: "File",
            export: "Export",
            stop: "Stop",
            rec: "Rec",
            log: "Log",
            info: "Info",
            process: "Process",
            processOn: "Process on",
            processOff: "Process off",
            detectedErrors: "Detected Errors",
            quit: "Quit",
            loop: "Loop",
            user: "User",
            email: "E-Mail",
            password: "Password",
            cancel: "Cancel",
            ok: "Ok",
            online: "Online",
            files: "Files",
            saveNew: "Save New",
            "delete": "Delete",
            registerOk: "Ok, check e-mail (spam folder) for last step.",
            register: "Registration",
            passwordRepeat: "Repeast password",
            logout: "Logout",
            faultyEmail: "Verify email",
            passwordToShort: "Password is to short, atleast 8 characters",
            login: "Login",
            error: "Error",
            selectFile: "Select a file",
            serverUsers: "Server Users",
            serverLogs: "Server Logs",
            admin: "Admin",
            note: "Note",
            name: "Name",
            validated: "Validated",
            createdAt: "Created at",
            willBeDeletedStartingFrom: "Delete starting from",
            debug: "Debug",
            numFiles: "Num. files",
            passwordMissmatch: "Password missmatch",
            changelog: "Changelog",
            license: appTexts.buildLicenseText(),
            changelogText: appTexts.buildChangelog(),
            helpText: appTexts.buildHelpText(),
            keysText: appTexts.buildKeysText()
        });
        lang.setLanguage("en");
    }
};
