/*jslint node: true */

/*global delayBuffer*/
/*global gBase*/

"use strict";

function gScope() {
    var that = gBase("canvas"),
        length = 1024,
        graphData = delayBuffer(length),
        ctx = that.getContext("2d"),
        xStep = that.width / graphData.length(),
        halfH = that.height / 2.0,
        gotData = 0,
        yMargins = 2;

    that.drawGraph = function (data) {
        var i = 0,
            x = 0,
            y = 0;

        if (data) {
            gotData += data.length;
            if (gotData < length) {
                return;
            }
            gotData = 0;
            graphData.setArray(data);
        }

        ctx.clearRect(0, 0, that.width, that.height);

        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0,  halfH);
        ctx.lineTo(that.width, halfH);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#0f0";
        ctx.beginPath();
        ctx.moveTo(0,  halfH - (halfH - yMargins) * graphData.get(0));
        for (i = 1; i < graphData.length(); i += 8) {
            x = xStep * i;
            y = halfH - (halfH - yMargins) * graphData.get(i);

            ctx.lineTo(x, y);
        }
        ctx.stroke();
        return that;
    };

    that.typeIs = "gScope";
    that.w(320).h(96).bg("#000");

    return that;
}
