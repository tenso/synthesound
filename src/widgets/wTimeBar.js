/*jslint node: true */

/*global util*/
/*global gBase*/
/*global log*/
/*global gui*/
/*global document*/
/*global timeSelection*/

"use strict";

function wTimeBar() {
    var that = gBase().bg("#888"),
        canvas = gBase("canvas"),
        ctx = canvas.getContext("2d"),
        totalMs = 1000,
        currentMs = 0,
        scroll = {
            x: 0,
            y: 0
        },
        zoom = {
            x: 1,
            y: 1
        },
        loop = {
            isOn: false,
            ms0: 0,
            ms1: 0
        },
        viewPort = {
            ms: {
                start: 0,
                len: totalMs,
                end: totalMs,
                pixelsPer: 0
            },
            h: {
                start: 0,
                len: canvas.height,
                end: canvas.height,
                pixelsPer: 0
            }
        },
        measureMs = 500,
        quantization = 1,
        selection = timeSelection(),
        keys = {
            ctrl: false,
            shift: false
        };

    function calcMouse(e) {
        var pos = gui.getEventOffsetInElement(canvas, e);
        pos.x = scroll.x * canvas.width + pos.x / zoom.x;
        pos.x *= totalMs / canvas.width;
        if (pos.x < -1) {
            pos.x = -1;
        }
        pos.y = scroll.y * canvas.height + pos.y / zoom.y;
        pos.y /= canvas.height;
        return {
            ms: pos.x,
            h: pos.y
        };
    }

    function drawBg() {
        var ms = 0,
            timeX = 0,
            measure = 0,
            measurePerBeat = Math.round(1 / quantization);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 1;

        if (zoom.x === 0 || zoom.y === 0) {
            log.error("zoom cant be 0");
            return;
        }

        if (measureMs > 0) {
            while (ms < totalMs) {
                measure += 1;
                ms += measureMs;
                if ((measure % measurePerBeat) === 0) {
                    ctx.strokeStyle = "#ddd";
                } else {
                    ctx.strokeStyle = "#999";
                }
                if (ms >= viewPort.ms.start) {
                    timeX = (ms - viewPort.ms.start) * viewPort.ms.pixelsPer;
                    ctx.beginPath();
                    ctx.moveTo(timeX,  0);
                    ctx.lineTo(timeX, canvas.height);
                    ctx.stroke();
                }
                if (ms >= viewPort.ms.end) {
                    break;
                }
            }
        }

        return that;
    }

    function drawMarker(ms, style) {
        var timeX = (ms - viewPort.ms.start) * viewPort.ms.pixelsPer;
        if (timeX > 0 && timeX < canvas.width) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = style;
            ctx.beginPath();
            ctx.moveTo(timeX,  0);
            ctx.lineTo(timeX, canvas.height);
            ctx.stroke();
            ctx.lineWidth = 1;
        }
    }

    function drawFg() {
        drawMarker(currentMs, "#000");
        drawMarker(loop.ms0, "#8ff");
        drawMarker(loop.ms1, "#44f");
        return that;
    }

    that.draw = function () {
        viewPort.ms.pixelsPer = zoom.x * canvas.width / totalMs;
        viewPort.ms.start = totalMs * scroll.x;
        viewPort.ms.len = totalMs / zoom.x;
        viewPort.ms.end = viewPort.ms.start + viewPort.ms.len;
        viewPort.ms.total = totalMs;

        viewPort.h.pixelsPer = zoom.y * canvas.height;
        viewPort.h.start = scroll.y;
        viewPort.h.len = canvas.height / zoom.y;
        viewPort.h.end = viewPort.h.start + viewPort.h.len;
        viewPort.h.total = 1.0;

        drawBg();
        that.emit("renderOver", canvas, currentMs, totalMs, viewPort);
        drawFg();
        selection.draw(canvas, totalMs, viewPort);
        return that;
    };

    that.setScroll = function (args) {
        util.setArgs(scroll, args);
        that.draw();
        return that;
    };

    that.setZoom = function (args) {
        util.setArgs(zoom, args);
        that.draw();
        return that;
    };

    /*that.resize = function (w, h) {
        canvas.width = w;
        canvas.height = h;
        canvas.w(w);
        canvas.h(h);
        console.log("canvas", w, h);
        console.log("total", that.getW(), that.getH());
        return that.draw();
    };*/

    that.setCurrentMs = function (ms) {
        currentMs = ms;
        return that.draw();
    };

    that.setTotalMs = function (ms) {
        totalMs = ms;
        return that.draw();
    };

    that.setTimeParams = function (bpmValue, quantValue, measureMsValue) {
        util.unused(bpmValue);
        quantization = quantValue;
        measureMs = measureMsValue;
        return that.draw();
    };

    that.getSelection = function () {
        return selection.get();
    };

    that.selectAll = function () {
        selection.start(0, 0.0);
        selection.end(totalMs, 1.0);
        return that;
    };

    that.setLoop = function (args) {
        util.setArgs(loop, args);
        that.draw();
    };

    that.getCanvas = function () {
        return canvas;
    };

    canvas.onmousedown = function (e) {
        gui.captureMouse(e);
    };

    canvas.on("mouseCaptured", function (e) {
        var pos = calcMouse(e);

        if (keys.ctrl && keys.shift) {
            if (e.button === 0) {
                selection.setMode("moveLoop0");
                loop.ms0 = pos.ms;
            } else if (e.button === 2) {
                selection.setMode("moveLoop1");
                loop.ms1 = pos.ms;
            }
        } else if (e.button === 2) {
            selection.setMode("select");
            selection.start(pos.ms, pos.h);
            that.draw();
        } else if (keys.ctrl && e.button === 0) {
            selection.setMode("setMs");
            that.emit("changeCurrentMs", pos.ms);
        } else if (e.button === 0) {
            if (selection.modeActive("")) {
                selection.setMode("selectionUpdated");
                selection.start(pos.ms, pos.h);
            }
        }
        that.draw();
    });

    canvas.on("mousePressAndMove", function (e, mouse) {
        var pos = calcMouse(e);
        util.unused(mouse);

        if (selection.modeActive("select")) {
            selection.end(pos.ms, pos.h);
        } else if (selection.modeActive("setMs")) {
            that.emit("changeCurrentMs", pos.ms);
        } else if (selection.modeActive("selectionUpdated")) {
            selection.end(pos.ms, pos.h);
            that.emit("selectionUpdated", selection.get(), false);
        } else if (selection.modeActive("moveLoop0")) {
            loop.ms0 = pos.ms;
        } else if (selection.modeActive("moveLoop1")) {
            loop.ms1 = pos.ms;
        }
        that.draw();
    });

    canvas.on("mouseUpAfterCapture", function (e) {
        util.unused(e);
        if (selection.modeActive("selectionUpdated")) {
            that.emit("selectionUpdated", selection.get(), true);
        } else if (selection.modeActive("selectionUpdated") || selection.modeActive("select")) {
            that.emit("newSelection", selection.get());
        } else if (selection.modeActive("moveLoop0") || selection.modeActive("moveLoop1")) {
            that.emit("loopUpdated", util.copyData(loop));
        }
        selection.setMode("");
        that.draw();
    });

    document.addEventListener("keydown", function (e) {
        keys.ctrl = e.ctrlKey;
        keys.shift = e.shiftKey;
    }, false);
    document.addEventListener("keyup", function (e) {
        keys.ctrl = e.ctrlKey;
        keys.shift = e.shiftKey;
    }, false);

    that.typeIs = "wTimeBar";
    return that;
}
