"use strict";
/*global util*/
/*global gBase*/
/*global window*/
/*global log*/
/*global gui*/
/*global document*/
/*global timeSelection*/

function wTimeBar() {
    var that = gBase().bg("#888"),
        canvas = gBase("canvas").addTo(that).w("100%").h("100%"),
        ctx = canvas.getContext("2d"),
        totalMs = 1000,
        currentMs = 0,
        measureMs = 500,
        pixelsPerMs = 0,
        selection = timeSelection(),
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

    that.draw = function () {
        pixelsPerMs = canvas.width / totalMs;
        drawBg();
        if (typeof renderOver === "function") {
            renderOver(canvas, currentMs, totalMs, pixelsPerMs);
        }
        drawFg();
        selection.draw(canvas, totalMs);
        return that;
    };

    that.resizeCanvas = function () {
        canvas.width = that.offsetWidth;
        canvas.height = that.offsetHeight;
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
        util.unused(bpmValue);
        util.unused(quantValue);

        measureMs = measureMsValue;
        return that.draw();
    };

    that.getSelection = function () {
        return selection.get();
    };

    that.newSelection = undefined;
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
            selection.setMode("select");
            selection.start(totalMs * pos.x / canvas.width, pos.y / canvas.height);
            that.draw();
        } else if (ctrlOn && e.button === 0) {
            selection.setMode("setMs");
            if (typeof that.changeCurrentMs === "function") {
                ms = totalMs * (that.parentNode.scrollLeft + e.pageX - that.getLeft()) / canvas.width;
                that.changeCurrentMs(ms);
            }
        } else if (e.button === 0) {
            if (selection.modeActive("")) {
                selection.setMode("selectionUpdated");
                selection.start(totalMs * pos.x / canvas.width, pos.y / canvas.height);
            }
        }
        that.draw();
    };

    canvas.iMousePressAndMove = function (e, mouse) {
        var ms,
            pos = gui.getEventOffsetInElement(that.parentNode, e);

        //FIXME:
        pos.x -= that.getLeft();
        pos.y -= that.getTop();

        if (selection.modeActive("select")) {
            selection.end(totalMs * pos.x / canvas.width, pos.y / canvas.height);
            that.draw();
        } else if (selection.modeActive("setMs")) {
            ms = totalMs * gui.getEventOffsetInElement(this, e).x / canvas.width;
            if (ms < 0) {
                ms = 0;
            }
            if (typeof that.changeCurrentMs === "function") {
                that.changeCurrentMs(ms);
            }
        } else if (selection.modeActive("selectionUpdated")) {
            selection.end(totalMs * pos.x / canvas.width, pos.y / canvas.height);
            if (typeof that.selectionUpdated === "function") {
                that.selectionUpdated(selection.get(), false);
            }
        }
    };

    canvas.iMouseUpAfterCapture = function (e) {
        if (selection.modeActive("selectionUpdated")) {
            if (typeof that.selectionUpdated === "function") {
                that.selectionUpdated(selection.get(), true);
            }
        } else if (!selection.modeActive("setMs")) {
            if (typeof that.newSelection === "function") {
                that.newSelection(selection.get());
            }
        }
        selection.setMode("");
        that.draw();
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
