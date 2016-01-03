"use strict";
/*global util*/
/*global gBase*/
/*global window*/
/*global log*/

function wTimeBar() {
    var that = gBase().bg("#888"),
        canvas = gBase("canvas").addTo(that).w("100%").h("100%"),
        ctx = canvas.getContext("2d"),
        halfH = that.height / 2.0;

    function draw() {
        ctx.clearRect(0, 0, that.width, that.height);

        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0,  halfH);
        ctx.lineTo(canvas.width, halfH);
        ctx.stroke();

        return that;
    }

    function resizeCanvas() {
        var workspaceWidth = that.offsetWidth,
            workspaceHeight = that.offsetHeight;

        that.width = workspaceWidth;
        that.height = workspaceHeight;
        halfH = canvas.height / 2.0;
        draw();
    }
    window.addEventListener("resize", resizeCanvas);

    that.setActiveSComp = function (scomp) {
        log.d("active comp:" + scomp.uid());
        return that;
    };

    that.setMs = function (ms) {
        util.unused(ms);
        return that;
    };

    that.typeIs = "wTimeBar";

    return that;
}
