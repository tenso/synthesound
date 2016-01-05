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
        renderOver;

    function drawBg() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0,  halfH);
        ctx.lineTo(canvas.width, halfH);
        ctx.stroke();

        return that;
    }

    function drawFg() {
        var timeX = currentMs * canvas.width / totalMs;

        ctx.beginPath();
        ctx.strokeStyle = "#8f8";
        ctx.moveTo(timeX,  0);
        ctx.lineTo(timeX, canvas.height);
        ctx.stroke();

        return that;
    }

    that.draw = function () {
        drawBg();
        if (typeof renderOver === "function") {
            renderOver(canvas, ctx, currentMs, totalMs, canvas.width / totalMs);
        }
        drawFg();
    };

    that.resizeCanvas = function () {
        var workspaceWidth = that.offsetWidth,
            workspaceHeight = that.offsetHeight;

        canvas.width = workspaceWidth;
        canvas.height = workspaceHeight;
        halfH = canvas.height / 2.0;
        that.draw();
    };

    that.setRenderer = function (render) {
        renderOver = render;
        that.draw();
        return that;
    };

    that.setCurrentMs = function (ms) {
        currentMs = ms;
        that.draw();
        return that;
    };

    that.setTotalMs = function (ms) {
        totalMs = ms;
        return that;
    };

    that.setTimeParams = function (bpm, quant) {
        return that;
    };

    that.changeCurrentMs = undefined;

    canvas.onmousedown = function (e) {
        gui.captureMouse(e);
    };

    canvas.iMouseCaptured = function (e, mouse) {
        if (typeof that.changeCurrentMs === "function") {
            that.changeCurrentMs(totalMs * mouse.x / canvas.width);
        }
    };

    canvas.iMousePressAndMove = function (e, mouse) {
        if (typeof that.changeCurrentMs === "function") {
            that.changeCurrentMs(totalMs * mouse.x / canvas.width);
        }
    };

    window.addEventListener("resize", that.resizeCanvas);
    that.typeIs = "wTimeBar";
    return that;
}
