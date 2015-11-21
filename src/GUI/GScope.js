"use strict";
/*global DelayBuffer*/

function GScope(canvasElement, chan) {
    this.length = 1024;
    this.graphData = new DelayBuffer(this.length);
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.chan = chan;
    this.step = 8;
    this.xStep = this.canvas.width / this.graphData.length;
    this.halfH = this.canvas.height / 2.0;
    this.ctx.strokeStyle = "#8f8";
    this.ctx.lineWidth = 2;
    this.gotData = 0;
}

GScope.prototype.drawGraph = function (data) {
    var i = 0,
        x = 0,
        y = 0;
    
    this.gotData += data.length;
    if (this.gotData < this.length) {
        return;
    }
    this.gotData = 0;
    this.graphData.setArray(data);
            
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.beginPath();
    this.ctx.moveTo(0,  this.halfH + this.halfH * this.graphData.get(0));
    for (i = 1; i < this.graphData.length; i += 8) {
        x = this.xStep * i;
        y = this.halfH + this.halfH * this.graphData.get(i);
        this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
};