/*jslint node: true */

/*global log*/

"use strict";

var lang = {
    language: "",
    strings: {},

    addLanguage: function (language, map) {
        lang.strings[language] = map;
    },

    setLanguage: function (language) {
        lang.language = language;
    },

    tr: function (id) {
        if (!lang.strings.hasOwnProperty(lang.language)) {
            log.error("no language: '" + lang.language + "'");
            return id;
        }
        if (lang.strings[lang.language].hasOwnProperty(id)) {
            return lang.strings[lang.language][id];
        }
        return id;
    }
};
