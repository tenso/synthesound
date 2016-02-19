/*jslint node: true */

/*global gContainer*/
/*global gLabel*/

"use strict";

//FIXME: make w() and color() func: "problem" need to change all childNodes.
function wMenu(width, textColor) {
    var that = gContainer().abs().bg("#fff");

    //FIXME: buildButton changes that!
    function buildButton(string, callback) {
        var entry,
            originalBg;

        if (that.contentCount() > 0) {
            that.nextRow();
        }
        entry = gLabel(string).textAlign("left").color(textColor || "#000").minWidth(width || 100);
        if (callback) {
            entry.onmousedown = callback;
        }

        entry.hoverEffect({color: "#fff", background: "#444"});
        return entry;
    }

    function removeListener() {
        that.remove();
    }

    that.addRow = function (string, callback) {
        that.addTabled(buildButton(string, callback));
        return that;
    };

    that.addOverlayed = function (string, element) {
        var entry = buildButton(string);
        entry.add(element);
        that.addTabled(entry);
        return that;
    };

    that.removeOnLeave = function (value) {
        if (value) {
            that.addEventListener("mouseleave", removeListener);
        } else {
            that.removeEventListener("mouseleave", removeListener);
        }
        return that;
    };

    that.typeIs = "wMenu";
    that.removeOnLeave(true);
    return that;
}
