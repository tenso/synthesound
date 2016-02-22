/*jslint node: true */
/*jslint es5: true*/

/*global lang*/

"use strict";

var appTexts = {
    buildHelpText: function () {
        var helpText = "<table style='min-width:100%;'>";

        function addTitle(title) {
            helpText += "<tr colspan=100><td class=helpTitle>" + title + "</td></tr>";
        }
        function addCommand(cmd, text) {
            helpText += "<tr><td class=helpCmd>" + cmd + "</td><td class=helpText>" + text + "</td></tr>";
        }

        addTitle("Global");
        addCommand("space", "play/pause");
        addTitle("\n");
        addTitle("Tracker");
        addCommand("leftdrag", "add new state on release");
        addCommand("ctrl-leftclick", "move current time");
        addCommand("ctrl-a", "select all states");
        addCommand("ctrl-c", "copy selected states");
        addCommand("rightdrag", "select states");
        addCommand("shift-rightdrag", "modify selection");
        addCommand("leftdrag", "move selected states");
        addCommand("shift-left-drag", "move end positions");
        addCommand("ctrl-scrollwheel", "zoom y");
        addCommand("ctrl-shift-scrollwheel", "zoom x");
        addCommand("ctrl-shift-leftdrag", "move loop start");
        addCommand("ctrl-shift-rightdrag", "move loop end");

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
            helpText: appTexts.buildHelpText(),
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
            registerOk: "Registration Ok, check your e-mail for final step",
            register: "Registration",
            passwordRepeat: "Repeast password",
            logout: "Logout",
            faultyEmail: "Verify email",
            passwordToShort: "Password is to short, atleast 8 characters",
            login: "Login",
            error: "Error",
            selectFile: "Select a file",
            license: appTexts.buildLicenseText()
        });
        lang.setLanguage("en");
    }
};
