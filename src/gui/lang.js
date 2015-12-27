"use strict";

//FIXME: make set
var lang = {
    strings: {
        en: {
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
        }
    },
    language: "en",

    tr: function (id) {
        if (lang.strings[lang.language].hasOwnProperty(id)) {
            return lang.strings[lang.language][id];
        }
        return id;
    }
};