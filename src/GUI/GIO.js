"use strict";
/*global log*/
/*global setMouseCapturer*/
/*global GUI*/

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
            drawLine(GUI.getPos(connections[i].from).x + GUI.getSize(connections[i].from).w / 2,
                     GUI.getPos(connections[i].from).y + GUI.getSize(connections[i].from).h / 2,
                     GUI.getPos(connections[i].to).x + GUI.getSize(connections[i].to).w / 2,
                     GUI.getPos(connections[i].to).y + GUI.getSize(connections[i].to).h / 2);
        }
    }
    
    function addConnection(from, to) {
        
        if (from.ioPort && to.ioPort) {
            if (!from.isOut || to.isOut) {
                log.error("connection not from out to in");
            }
            var con = {"from": from, "to": to};
            connections.push(con);
            
            to.ioPort.addInput(from.ioPort, to.ioType);
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
    
    log.info("GIO: connecting " + ioports.length + " ports");
    for (i = 0; i < ioports.length; i += 1) {
        addMouseEventsToPort(ioports[i]);
    }
}

function initGIO(target, scomp, isOut, type) {
    target.className = "ioport";
    
    if (isOut) {
        target.className += " ioport-out";
    } else {
        target.className += " ioport-in";
    }
    target.ioPort = scomp;
    target.isOut = isOut;
    target.ioType = type;
}

function makeGIO(scomp, isOut, type) {
    var ioport = document.createElement("div");
    initGIO(ioport, scomp, isOut, type);
    return ioport;
}
