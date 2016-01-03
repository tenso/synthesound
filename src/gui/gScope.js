"use strict";
/*global delayBuffer*/
/*global gui*/
/*global gBase*/

function gScope(channel) {
    var that = gBase(),
        length = 1024,
        graphData = delayBuffer(length),
        canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        chan = channel,
        step = 8,
        xStep = canvas.width / graphData.length(),
        halfH = canvas.height / 2.0,
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

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0,  halfH);
        ctx.lineTo(canvas.width, halfH);
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

    canvas.className = "gScope";
    that.typeIs = "gScope";
    that.appendChild(canvas);

    return that;
}
