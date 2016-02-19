/*jslint node: true */

/*global gContainer*/
/*global gLabel*/

"use strict";

//FIXME: make w() and color() func: "problem" need to change all childNodes.
function wList(width, textColor) {
    var that = gContainer().abs().bg("#fff"),
        selected;

    //FIXME: buildButton changes that!
    function buildButton(string, callback) {
        var entry,
            originalBg;

        if (that.contentCount() > 0) {
            that.nextRow();
        }
        entry = gLabel(string).textAlign("left").color(textColor || "#000").minWidth(width || 100);
        entry.onmousedown = function () {
            if (selected) {
                selected.bg("");
            }
            selected = entry;
            selected.bg("#666");
            if (typeof callback === "function") {
                callback(string);
            }
        };
        entry.hoverEffect({color: "#aaa"});
        return entry;
    }

    that.addRow = function (string, callback) {
        var button = buildButton(string, callback);
        that.addTabled(button);
        return that;
    };

    that.addOverlayed = function (string, element) {
        var entry = buildButton(string);
        entry.add(element);
        that.addTabled(entry);
        return that;
    };

    that.deselect = function () {
        if (selected) {
            selected.bg("#fff");
            selected = undefined;
        }
        return that;
    };

    that.selected = function () {
        if (selected) {
            return selected.getValue();
        }
        return "";
    };

    that.typeIs = "wMenu";
    return that;
}
