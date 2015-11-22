"use strict";
/*global logInfo*/
/*global logError*/
/*global setMouseCapturer*/
/*global getPos*/
/*global getSize*/

function connectAllGIO(canvas) {
    var ioports = document.getElementsByClassName("ioport"),
        i,
        linesCanvas = canvas,
        linesCtx = linesCanvas.getContext("2d"),
        pressX,
        pressY,
        connections = [];
        
    function drawLine(fromX, fromY, toX, toY) {
        linesCtx.beginPath();
        linesCtx.strokeStyle = "#0ff";
        linesCtx.lineWidth = 2;
        linesCtx.moveTo(fromX, fromY);
        linesCtx.lineTo(toX, toY);
        linesCtx.stroke();
    }
    
    function drawConnections() {
        var i;
        
        linesCtx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);
        
        for (i = 0; i < connections.length; i += 1) {
            drawLine(getPos(connections[i].from).x + getSize(connections[i].from).w / 2,
                     getPos(connections[i].from).y + getSize(connections[i].from).h / 2,
                     getPos(connections[i].to).x + getSize(connections[i].to).w / 2,
                     getPos(connections[i].to).y + getSize(connections[i].to).h / 2);
        }
    }
    
    function addConnection(from, to) {
        
        if (from.ioPort && to.ioPort) {
            if (!from.isOut || to.isOut) {
                logError("connection not from out to in");
            }
            window.console.log("connect from:" + from.id + " to:" + to.id);
            var con = {"from": from, "to": to};
            connections.push(con);
            
            to.ioPort.addInput(from.ioPort);
        }
    }
        
    function resizeCanvas() {
        linesCanvas.width = window.innerWidth;
        linesCanvas.height = window.innerHeight;
        drawConnections();
    }
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
        
    function addMouseEventsToPort(port) {
        port.onmousedown = function (e) {
            if (e.target.ioPort && e.target.isOut) {
                pressX = e.pageX;
                pressY = e.pageY;
                setMouseCapturer(e);
            }
        };
        port.onmousepressandmove = function (e) {
            drawConnections();
            drawLine(pressX, pressY, e.pageX, e.pageY);
        };
        port.onmouseupaftercapture = function (e) {
            if (e.target.ioPort && !e.target.isOut) {
                addConnection(e.mouseCapturer, e.target);
            }
            drawConnections();
        };
    }
    
    logInfo("GIO: connecting " + ioports.length + " ports");
    for (i = 0; i < ioports.length; i += 1) {
        addMouseEventsToPort(ioports[i]);
    }
}

function initGIO(target, scomp, isOut) {
    target.className = "ioport";
    
    if (isOut) {
        target.className += " ioport-out";
    } else {
        target.className += " ioport-in";
    }
    target.ioPort = scomp;
    target.isOut = isOut;
}

function makeGIO(scomp, isOut) {
    var ioport = document.createElement("div");
    initGIO(ioport, scomp, isOut);
    return ioport;
}
