"use strict";
/*global util*/
/*global gBase*/
/*global window*/
/*global log*/
/*global gui*/
/*global document*/

function wTimeBar() {
    var that = gBase().bg("#888"),
        canvas = gBase("canvas").addTo(that).w("100%").h("100%"),
        ctx = canvas.getContext("2d"),
        halfH = that.height / 2.0,
        totalMs = 1000,
        currentMs = 0,
        measureMs = 500,
        quant = 0,
        bpm = 0,
        pixelsPerMs = 0,
        selection = {
            startMs: 0,
            startH: 0,
            endMs: 0,
            endH: 0
        },
        renderOver,
        ctrlOn = false;

    function drawBg() {
        var ms = 0,
            timeX = 0;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 1;

        ctx.beginPath();
        if (measureMs > 0) {
            while (ms < totalMs) {
                ms += measureMs;
                timeX = ms * pixelsPerMs;
                ctx.moveTo(timeX,  0);
                ctx.lineTo(timeX, canvas.height);
            }
        }
        ctx.stroke();

        return that;
    }

    function drawFg() {
        var timeX = currentMs * pixelsPerMs;
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#8f8";
        ctx.beginPath();
        ctx.moveTo(timeX,  0);
        ctx.lineTo(timeX, canvas.height);
        ctx.stroke();
        ctx.lineWidth = 1;

        return that;
    }

    function drawSelection() {
        var start,
            startY,
            end,
            endY;

        if (selection.startMs !== selection.endMs) {
            start = selection.startMs * canvas.width / totalMs;
            end = selection.endMs * canvas.width / totalMs;

            startY = selection.startH * canvas.height;
            endY = selection.endH * canvas.height;

            ctx.fillStyle = "rgba(0, 255, 255, 0.25)";
            ctx.fillRect(start, startY, end - start, endY - startY);
        }

        return that;
    }

    that.draw = function () {
        pixelsPerMs = canvas.width / totalMs;
        drawBg();
        if (typeof renderOver === "function") {
            renderOver(canvas, currentMs, totalMs, pixelsPerMs);
        }
        drawFg();
        drawSelection();
        return that;
    };

    that.resizeCanvas = function () {
        canvas.width = that.offsetWidth;
        canvas.height = that.offsetHeight;
        halfH = canvas.height / 2.0;
        return that.draw();
    };

    that.setRenderer = function (render) {
        renderOver = render;
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
        bpm = bpmValue;
        quant = quantValue;
        measureMs = measureMsValue;
        return that.draw();
    };

    that.getSelection = function () {
        return {
            startH: Math.min(selection.startH, selection.endH),
            endH: Math.max(selection.startH, selection.endH),
            startMs: Math.min(selection.startMs, selection.endMs),
            endMs: Math.max(selection.startMs, selection.endMs)
        };
    };
    
    that.selectionMoved = undefined;
    that.changeCurrentMs = undefined;

    canvas.onmousedown = function (e) {
        gui.captureMouse(e);
    };

    //FIXME: dont use that.parentNode here: move scroll to this comp!
    canvas.iMouseCaptured = function (e) {
        var pos = gui.getEventOffsetInElement(that.parentNode, e),
            ms;

        //FIXME:
        pos.x -= that.getLeft();
        pos.y -= that.getTop();
        
        if (e.button === 2) {
            selection.startMs = totalMs * pos.x / canvas.width;
            selection.startH = pos.y / canvas.height;
            selection.endMs = selection.startMs;
            selection.endH = selection.startH;

            that.draw();
        } else if (ctrlOn && e.button === 0) {
            if (typeof that.changeCurrentMs === "function") {
                ms = totalMs * (that.parentNode.scrollLeft + e.pageX - that.getLeft()) / canvas.width;
                that.changeCurrentMs(ms);
            }
        }
    };

    canvas.iMousePressAndMove = function (e) {
        var ms,
            pos = gui.getEventOffsetInElement(that.parentNode, e);

        //FIXME:
        pos.x -= that.getLeft();
        pos.y -= that.getTop();
        
        if (e.button === 2) {
            selection.endMs = totalMs * pos.x / canvas.width;
            selection.endH = pos.y / canvas.height;
            that.draw();
        } else if (ctrlOn && e.button === 0) {
            ms = totalMs * (that.parentNode.scrollLeft + e.pageX - that.getLeft()) / canvas.width;
            if (ms < 0) {
                ms = 0;
            }
            if (typeof that.changeCurrentMs === "function") {
                that.changeCurrentMs(ms);
            }
        } else if (e.button === 0) {
            selection.startMs += e.movementX / pixelsPerMs;
            selection.endMs += e.movementX / pixelsPerMs;

            selection.startH += e.movementY / canvas.height;
            selection.endH += e.movementY / canvas.height;

            that.draw();
            if (typeof that.selectionMoved === "function") {
                that.selectionMoved(that.getSelection());
            }
        }
    };

    canvas.iMouseUpAfterCapture = function (e) {
    };

    document.addEventListener("keydown", function (e) {
        ctrlOn = e.ctrlKey;
    }, false);
    document.addEventListener("keyup", function (e) {
        ctrlOn = e.ctrlKey;
    }, false);

    window.addEventListener("resize", that.resizeCanvas);
    that.typeIs = "wTimeBar";
    return that;
}
