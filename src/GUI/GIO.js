"use strict";
/*global logInfo*/
/*global logError*/
/*global setMouseCapturer*/

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
            drawLine(connections[i].from.offsetLeft + connections[i].from.offsetWidth / 2,
                     connections[i].from.offsetTop + connections[i].from.offsetHeight / 2,
                     connections[i].to.offsetLeft + connections[i].to.offsetWidth / 2,
                     connections[i].to.offsetTop + connections[i].to.offsetHeight / 2);
        }
    }
    
    function addConnection(from, to) {
        
        if (from.ioPort && to.ioPort) {
            if (!from.isOut || to.isOut) {
                logError("connection not from out to in");
            }
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
    
    logInfo("connecting " + ioports.length + " ports");
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
