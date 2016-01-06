"use strict";
/*global gContainer*/
/*global gLabel*/

function wMenu() {
    var that = gContainer().abs().bg("#fff");

    //FIXME: buildButton changes that!
    function buildButton(string, callback) {
        var entry,
            originalBg;

        if (that.contentCount() > 0) {
            that.nextRow();
        }
        entry = gLabel(string).textAlign("left").color("#000");
        if (callback) {
            entry.onmousedown = callback;
        }

        entry.onmouseover = function () {
            originalBg = entry.style.background;
            entry.style.background = "#aaa";
        };

        entry.onmouseout = function () {
            entry.style.background = originalBg;
        };
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
