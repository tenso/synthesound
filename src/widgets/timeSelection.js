"use strict";
function timeSelection() {
    var that = {},
        mode = "";

    that.initialMs = 0;
    that.initialH = 0;
    that.startMs = 0;
    that.startH = 0;
    that.endMs = 0;
    that.endH = 0;

    that.lenMs = function () {
        return that.endMs - that.startMs;
    };

    that.lenH = function () {
        return that.endH - that.startH;
    };

    that.start = function (ms, h) {
        that.initialMs = that.startMs = that.endMs = ms;
        that.initialH = that.startH = that.endH = h;
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
            startH: Math.min(that.startH, that.endH),
            endH: Math.max(that.startH, that.endH),
            startMs: Math.min(that.startMs, that.endMs),
            endMs: Math.max(that.startMs, that.endMs),
            initialMs: that.initialMs,
            initialH: that.initialH,
            movedMs: that.startMs - that.initialMs,
            movedH: that.initialH - that.startH,
            lenMs: that.lenMs(),
            lenH: that.lenH()
        };
    };

    that.move = function (ms, maxMs, h, maxH) {
        var lenMs = that.lenMs(),
            lenH = that.lenH();

        if (ms + lenMs > maxMs) {
            ms = maxMs - lenMs;
        }
        that.startMs = ms;
        if (that.startMs < 0) {
            that.startMs = 0;
        }
        that.endMs = that.startMs + lenMs;

        if (h + lenH > maxH) {
            h = maxH - lenH;
        }
        that.startH = h;
        if (that.startH < 0) {
            that.startH = 0;
        }
        that.endH = that.startH + lenH;

        return that;
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
                ctx.fillStyle = "rgba(0, 255, 255, 0.25)";
                ctx.fillRect(start, startY, end - start, endY - startY);
            }
        }

        return that;
    };

    return that;
}
