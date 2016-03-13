/*jslint node: true */

/*global util*/
/*global gBase*/
/*global log*/
/*global gui*/
/*global document*/
/*global timeSelection*/

"use strict";

function gViewportCanvas() {
    var that = gBase("canvas"),
        ctx = that.getContext("2d"),
        font = {
            font: "",
            size: 0
        },
        scroll = {
            x: 0,
            y: 0
        },
        zoom = {
            x: 1,
            y: 1
        },
        viewport = {
            x: {
                start: 0,
                len: 1.0,
                end: 1.0,
                pixelsPer: 0
            },
            y: {
                start: 0,
                len: 1.0,
                end: 1.0,
                pixelsPer: 0
            }
        };

    function calcViewport() {
        viewport.x.pixelsPer = zoom.x * that.width;
        viewport.x.start = scroll.x;
        viewport.x.len = 1.0 / zoom.x;
        viewport.x.end = viewport.x.start + viewport.x.len;
        viewport.x.total = 1.0;

        viewport.y.pixelsPer = zoom.y * that.height;
        viewport.y.start = scroll.y;
        viewport.y.len = 1.0 / zoom.y;
        viewport.y.end = viewport.y.start + viewport.y.len;
        viewport.y.total = 1.0;

        return that;
    }

    that.calcMouse = function (e, scaleX, scaleY) {
        var pos = gui.getEventOffsetInElement(that, e);
        pos.x = scroll.x * that.width + pos.x / zoom.x;
        pos.x *= (scaleX || 1.0) / that.width;

        pos.y = scroll.y * that.height + pos.y / zoom.y;
        pos.y *= (scaleY || 1.0) / that.height;
        return {
            x: pos.x,
            y: pos.y
        };
    };

    that.xVisible = function (x) {
        return x >= viewport.x.start && x <= viewport.x.end;
    };

    that.yVisible = function (y) {
        return y >= viewport.y.start && y <= viewport.y.end;
    };

    that.clearRect = function (x, y, w, h) {
        ctx.clearRect(x, y, w, h);
        return that;
    };

    that.clear = function () {
        return that.clearRect(0, 0, that.width, that.height);
    };

    that.lineWidth = function (w) {
        ctx.lineWidth = w;
        return that;
    };

    that.strokeStyle = function (style) {
        ctx.strokeStyle = style;
        return that;
    };

    that.beginPath = function () {
        ctx.beginPath();
        return that;
    };

    that.scalePos = function (x, y) {
        return {
            x: (x - viewport.x.start) * viewport.x.pixelsPer,
            y: (y - viewport.y.start) * viewport.y.pixelsPer
        };
    };

    that.scaleSize = function (w, h) {
        return {
            w: typeof w === "number" ? w * viewport.x.pixelsPer : undefined,
            h: typeof h === "number" ? h * viewport.y.pixelsPer : undefined
        };
    };

    that.moveTo = function (x, y) {
        var pos = that.scalePos(x, y);
        ctx.moveTo(pos.x, pos.y);
        return that;
    };

    that.lineTo = function (x, y) {
        var pos = that.scalePos(x, y);
        ctx.lineTo(pos.x, pos.y);
        return that;
    };

    that.line = function (x0, y0, x1, y1) {
        that.beginPath();
        that.moveTo(x0, y0);
        that.lineTo(x1, y1);
        that.stroke();
        return that;
    };

    that.stroke = function () {
        ctx.stroke();
        return that;
    };

    that.fillStyle = function (style) {
        ctx.fillStyle = style;
        return that;
    };

    that.fillRect = function (x, y, w, h) {
        var pos = that.scalePos(x, y),
            size = that.scaleSize(w, h);

        ctx.fillRect(pos.x, pos.y, size.w, size.h);
        return that;
    };

    that.scroll = function (args) {
        util.setArgs(scroll, args);
        calcViewport();
        return that;
    };

    that.zoom = function (args) {
        util.setArgs(zoom, args);
        if (zoom.x === 0 || zoom.y === 0) {
            log.error("gViewportCanvas.zoom: zoom cant be 0");
        }
        calcViewport();
        return that;
    };

    that.getZoom = function () {
        return zoom;
    };

    that.fillText = function (text, x, y) {
        var pos = that.scalePos(x, y);
        ctx.fillText(text, pos.x, pos.y);
        return that;
    };

    that.font = function (name) {
        font.font = name;
        ctx.font = font.size + "px " + font.font;
        return that;
    };

    that.fontSize = function (px) {
        font.size = px;
        ctx.font = font.size + "px " + font.font;
        return that;
    };

    that.resize = function (w, h) {
        that.width = w;
        that.height = h;
        that.w(w);
        that.h(h);
        return that;
    };

    return that;
}
