"use strict";
/*global delayBuffer*/

function gScope(canvasElement, channel) {
    var that = {},
        length = 1024,
        graphData = delayBuffer(length),
        canvas = canvasElement,
        ctx = canvas.getContext("2d"),
        chan = channel,
        step = 8,
        xStep = canvas.width / graphData.length(),
        halfH = canvas.height / 2.0,
        gotData = 0;
    
    ctx.strokeStyle = "#8f8";
    ctx.lineWidth = 2;

    that.drawGraph = function (data) {
        var i = 0,
            x = 0,
            y = 0;

        gotData += data.length;
        if (gotData < length) {
            return;
        }
        gotData = 0;
        graphData.setArray(data);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(0,  halfH + halfH * graphData.get(0));
        for (i = 1; i < graphData.length(); i += 8) {
            x = xStep * i;
            y = halfH + halfH * graphData.get(i);

            ctx.lineTo(x, y);
        }
        ctx.stroke();
    };
    return that;
}