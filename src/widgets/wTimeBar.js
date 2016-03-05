/*jslint node: true */

/*global util*/
/*global gBase*/
/*global window*/
/*global log*/
/*global gui*/
/*global document*/
/*global timeSelection*/

"use strict";

function wTimeBar() {
    var that = gBase().bg("#888"),
        canvas = gBase("canvas").addTo(that).w("100%").h("100%"),
        ctx = canvas.getContext("2d"),
        totalMs = 1000,
        currentMs = 0,
        loop = {
            isOn: false,
            ms0: 0,
            ms1: 0
        },
        measureMs = 500,
        pixelsPerMs = 0,
        quantization = 1,
        selection = timeSelection(),
        keys = {
            ctrl: false,
            shift: false
        };

    //FIXME: dont use that.parentNode here: move scroll to this comp!
    function calcMouse(e) {
        var pos = gui.getEventOffsetInElement(that.parentNode, e);
        pos.x -= that.getLeft();
        pos.x *= totalMs / canvas.width;
        if (pos.x < -1) {
            pos.x = -1;
        }
        pos.y -= that.getTop();
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

        if (measureMs > 0) {
            while (ms < totalMs) {
                measure += 1;
                ms += measureMs;
                timeX = ms * pixelsPerMs;
                if ((measure % measurePerBeat) === 0) {
                    ctx.strokeStyle = "#ddd";
                } else {
                    ctx.strokeStyle = "#999";
                }
                ctx.beginPath();
                ctx.moveTo(timeX,  0);
                ctx.lineTo(timeX, canvas.height);
                ctx.stroke();
            }
        }

        return that;
    }

    function drawMarker(ms, style) {
        var timeX = ms * pixelsPerMs;
        ctx.lineWidth = 2;
        ctx.strokeStyle = style;
        ctx.beginPath();
        ctx.moveTo(timeX,  0);
        ctx.lineTo(timeX, canvas.height);
        ctx.stroke();
        ctx.lineWidth = 1;
    }

    function drawFg() {
        drawMarker(currentMs, "#000");
        drawMarker(loop.ms0, "#8ff");
        drawMarker(loop.ms1, "#44f");
        return that;
    }

    that.draw = function () {
        pixelsPerMs = canvas.width / totalMs;
        drawBg();
        that.emit("renderOver", canvas, currentMs, totalMs, pixelsPerMs);
        drawFg();
        selection.draw(canvas, totalMs);
        return that;
    };

    that.resizeCanvas = function () {
        canvas.width = that.offsetWidth;
        canvas.height = that.offsetHeight;
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

    window.addEventListener("resize", that.resizeCanvas);
    that.typeIs = "wTimeBar";
    return that;
}
