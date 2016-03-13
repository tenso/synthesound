/*jslint node: true */

/*global util*/
/*global gBase*/
/*global log*/
/*global gui*/
/*global document*/
/*global timeSelection*/
/*global gViewportCanvas*/

"use strict";

function wTimeBar() {
    var that = gBase().bg("#888"),
        canvas = gViewportCanvas("canvas"),
        totalMs = 1000,
        currentMs = 0,
        loop = {
            isOn: false,
            ms0: 0,
            ms1: 0
        },
        measureMs = 500,
        quantization = 1,
        selection = timeSelection(),
        keys = {
            ctrl: false,
            shift: false
        };

    function drawBg() {
        var ms = 0,
            timeX = 0,
            measure = 0,
            stepMs = measureMs,
            measurePerBeat = Math.round(1 / quantization),
            linesOnScreen = totalMs / (canvas.getZoom().x * stepMs);

        canvas.clear();
        canvas.lineWidth(1);

        if (linesOnScreen >= 1000) {
            stepMs = totalMs / (1000 * canvas.getZoom().x);
        }
        if (stepMs > 0) {
            while (ms < totalMs) {
                measure += 1;
                ms += stepMs;
                timeX = ms / totalMs;

                if (canvas.xVisible(timeX)) {
                    if ((measure % measurePerBeat) === 0) {
                        canvas.strokeStyle("#ddd");
                    } else {
                        canvas.strokeStyle("#999");
                    }
                    canvas.line(timeX,  0, timeX, 1.0);
                }
            }
        }
        return that;
    }

    function drawMarker(ms, style) {
        var timeX = ms / totalMs;
        if (canvas.xVisible(timeX)) {
            canvas.lineWidth(2);
            canvas.strokeStyle(style);
            canvas.line(timeX,  0, timeX, 1.0);
        }
    }

    function drawFg() {
        drawMarker(currentMs, "#000");
        drawMarker(loop.ms0, "#8ff");
        drawMarker(loop.ms1, "#44f");
        return that;
    }

    that.draw = function () {
        drawBg();
        that.emit("renderOver", canvas);
        drawFg();
        selection.draw(canvas, totalMs);
        return that;
    };

    that.scroll = function (args) {
        canvas.scroll(args);
        that.draw();
        return that;
    };

    that.zoom = function (args) {
        canvas.zoom(args);
        that.draw();
        return that;
    };

    that.resize = function (w, h) {
        canvas.resize(w, h);
        return that.draw();
    };

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
        var pos = canvas.calcMouse(e, totalMs, 1.0);
        if (pos.x < -1) {
            pos.x = -1;
        }

        if (keys.ctrl && keys.shift) {
            if (e.button === 0) {
                selection.setMode("moveLoop0");
                loop.ms0 = pos.x;
            } else if (e.button === 2) {
                selection.setMode("moveLoop1");
                loop.ms1 = pos.x;
            }
        } else if (e.button === 2) {
            selection.setMode("select");
            selection.start(pos.x, pos.y);
            that.draw();
        } else if (keys.ctrl && e.button === 0) {
            selection.setMode("setMs");
            that.emit("changeCurrentMs", pos.x);
        } else if (e.button === 0) {
            if (selection.modeActive("")) {
                selection.setMode("selectionUpdated");
                selection.start(pos.x, pos.y);
            }
        }
        that.draw();
    });

    canvas.on("mousePressAndMove", function (e, mouse) {
        var pos = canvas.calcMouse(e, totalMs, 1.0);
        if (pos.x < -1) {
            pos.x = -1;
        }
        util.unused(mouse);

        if (selection.modeActive("select")) {
            selection.end(pos.x, pos.y);
        } else if (selection.modeActive("setMs")) {
            that.emit("changeCurrentMs", pos.x);
        } else if (selection.modeActive("selectionUpdated")) {
            selection.end(pos.x, pos.y);
            that.emit("selectionUpdated", selection.get(), false);
        } else if (selection.modeActive("moveLoop0")) {
            loop.ms0 = pos.x;
        } else if (selection.modeActive("moveLoop1")) {
            loop.ms1 = pos.x;
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
