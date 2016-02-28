/*jslint node: true */

/*global log*/

"use strict";

function gStyleState(that) {
    var saved = [],
        changes = {};

    function getStyle(styleMap) {
        var style = {},
            change;

        for (change in styleMap) {
            if (styleMap.hasOwnProperty(change)) {
                style[change] = that.style[change];
            }
        }
        return style;
    }

    that.setStyleStateChanges = function (styleMap) {
        changes = styleMap;
        return that;
    };

    that.applyStyle = function (styleMap) {
        var change;
        for (change in styleMap) {
            if (styleMap.hasOwnProperty(change)) {
                that.style[change] = styleMap[change];
            }
        }
        return that;
    };

    that.pushStyle = function () {
        if (saved.length > 100) {
            log.error("state stack to deep, abort");
            return that;
        }
        saved.push(getStyle(changes));
        that.applyStyle(changes);
        return that;
    };

    that.popStyle = function () {
        if (!saved.length) {
            log.error("gStyleState.popStyle: no style pushed");
        }
        var state = saved.pop();
        that.applyStyle(state);
        return that;
    };

    return that;
}
