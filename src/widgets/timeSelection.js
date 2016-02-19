/*jslint node: true */

"use strict";
function timeSelection() {
    var that = {},
        mode = "";

    that.startMs = 0;
    that.startH = 0;
    that.endMs = 0;
    that.endH = 0;

    that.start = function (ms, h) {
        that.startMs = that.endMs = ms;
        that.startH = that.endH = h;
        return that;
    };

    that.end = function (ms, h) {
        that.endMs = ms;
        that.endH = h;
        return that;
    };

    that.haveArea = function () {
        return (that.startMs !== that.endMs
                && that.startH !== that.endH);
    };

    that.modeActive = function (value) {
        return mode === value;
    };

    that.setMode = function (value) {
        mode = value;
        return that;
    };

    that.get = function () {
        return {
            startH: that.startH,
            endH: that.endH,
            startMs: that.startMs,
            endMs: that.endMs,
            minMs: Math.min(that.startMs, that.endMs),
            maxMs: Math.max(that.startMs, that.endMs),
            minH: Math.min(that.startH, that.endH),
            maxH: Math.max(that.startH, that.endH)
        };
    };

    that.draw = function (canvas, totalMs) {
        var start,
            startY,
            end,
            endY,
            pixelsPerMs = canvas.width / totalMs,
            ctx = canvas.getContext("2d");

        if (that.haveArea()) {
            if (that.modeActive("select") || that.modeActive("moveSelect")) {
                start = that.startMs * pixelsPerMs;
                end = that.endMs * pixelsPerMs;
                startY = that.startH * canvas.height;
                endY = that.endH * canvas.height;
                ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
                ctx.fillRect(start, startY, end - start, endY - startY);
            }
        }

        return that;
    };

    return that;
}
