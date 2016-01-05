"use strict";
/*global util*/
/*global gBase*/
/*global window*/
/*global log*/
/*global gui*/

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
        renderOver;

    function drawBg() {
        var ms = 0,
            timeX = 0;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(0,  halfH);
        ctx.lineTo(canvas.width, halfH);


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

        ctx.beginPath();
        ctx.strokeStyle = "#8f8";
        ctx.moveTo(timeX,  0);
        ctx.lineTo(timeX, canvas.height);
        ctx.stroke();

        return that;
    }

    that.draw = function () {
        pixelsPerMs = canvas.width / totalMs;
        drawBg();
        if (typeof renderOver === "function") {
            renderOver(canvas, ctx, currentMs, totalMs, pixelsPerMs);
        }
        drawFg();
        return that;
    };

    that.resizeCanvas = function () {
        var workspaceWidth = that.offsetWidth,
            workspaceHeight = that.offsetHeight;

        canvas.width = workspaceWidth;
        canvas.height = workspaceHeight;
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
        return that;
    };

    that.setTimeParams = function (bpmValue, quantValue, measureMsValue) {
        bpm = bpmValue;
        quant = quantValue;
        measureMs = measureMsValue;
        return that.draw();
    };

    that.changeCurrentMs = undefined;

    canvas.onmousedown = function (e) {
        gui.captureMouse(e);
    };

    canvas.iMouseCaptured = function (e, mouse) {
        if (typeof that.changeCurrentMs === "function") {
            that.changeCurrentMs(totalMs * (that.parentNode.scrollLeft + mouse.x) / canvas.width);
        }
    };

    canvas.iMousePressAndMove = function (e, mouse) {
        if (typeof that.changeCurrentMs === "function") {
            that.changeCurrentMs(totalMs * (that.parentNode.scrollLeft + mouse.x) / canvas.width);
        }
    };

    window.addEventListener("resize", that.resizeCanvas);
    that.typeIs = "wTimeBar";
    return that;
}
