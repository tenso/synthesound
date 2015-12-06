"use strict";
/*global log*/
/*global input*/
/*global gui*/

var gIO = {
    linesCanvas: undefined,
    linesCtx: undefined,
    connections: [],

    drawLine: function (fromX, fromY, toX, toY) {
        gIO.linesCtx.beginPath();
        gIO.linesCtx.moveTo(fromX, fromY);
        gIO.linesCtx.lineTo(toX, toY);
        gIO.linesCtx.stroke();
    },

    drawConnections: function () {
        var i;

        gIO.linesCtx.clearRect(0, 0, gIO.linesCanvas.width, gIO.linesCanvas.height);

        for (i = 0; i < gIO.connections.length; i += 1) {
            gIO.drawLine(gui.getPos(gIO.connections[i].from).x + gui.getSize(gIO.connections[i].from).w / 2,
                         gui.getPos(gIO.connections[i].from).y + gui.getSize(gIO.connections[i].from).h / 2,
                         gui.getPos(gIO.connections[i].to).x + gui.getSize(gIO.connections[i].to).w / 2,
                         gui.getPos(gIO.connections[i].to).y + gui.getSize(gIO.connections[i].to).h / 2);
        }
    },
    
    connectAll: function (canvas) {
        var i;
            
        gIO.linesCanvas = canvas;
        gIO.linesCtx = gIO.linesCanvas.getContext("2d");
        gIO.linesCtx.strokeStyle = "#000";
        gIO.linesCtx.lineWidth = 2;
        
        function resizeCanvas() {
            gIO.linesCanvas.width = window.innerWidth;
            gIO.linesCanvas.height = window.innerHeight;
            gIO.drawConnections();
        }

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
    },
    
    haveConnection: function (from, to) {
        var i;
        for (i = 0; i < gIO.connections.length; i += 1) {
            if (gIO.connections[i].from === from && gIO.connections[i].to === to) {
                return true;
            }
        }
        return false;
    },
    
    getConnectionsFrom: function (ioPort) {
        var i,
            connections = [];
        
        for (i = 0; i < gIO.connections.length; i += 1) {
            if (gIO.connections[i].from === ioPort) {
                connections.push(gIO.connections[i].to);
            }
        }
        return connections;
    },
    
    getConnectionsTo: function (ioPort) {
        var i,
            connections = [];
        
        for (i = 0; i < gIO.connections.length; i += 1) {
            if (gIO.connections[i].to === ioPort) {
                connections.push(gIO.connections[i].from);
            }
        }
        return connections;
    },
        
    addConnection: function (from, to) {

        if (from.ioPort && to.ioPort) {
            if (!from.isOut || to.isOut) {
                log.error("connection is not from out to in");
                return false;
            }
            if (from.ioPort === to.ioPort) {
                log.warn("inter component feedback not allowed");
                return false;
            }
            if (gIO.haveConnection(from, to)) {
                log.warn("already have connection");
                return false;
            }
            var con = {"from": from, "to": to};
            gIO.connections.push(con);

            to.ioPort.addInput(from.ioPort, to.ioType);
            return true;
        }
    },

    addMouseEventsToPort: function (port) {

        port.onmousedown = function (e) {
            if (e.target.ioPort && e.target.isOut) {
                input.setMouseCapturer(e);
            }
        };
        port.onmousepressandmove = function (e, mouse) {
            gIO.drawConnections();
            gIO.drawLine(mouse.captureX, mouse.captureY, e.pageX, e.pageY);
        };
        port.onmouseupaftercapture = function (e) {
            if (e.target.ioPort && !e.target.isOut) {
                gIO.addConnection(e.mouseCapturer, e.target);
            }
            gIO.drawConnections();
        };
        port.onopencontextmenu = function (e) {
            var connections;
            
            if (!e.target.ioPort) {
                log.error("no ioPort found");
                return;
            }
            
            if (e.target.isOut) {
                log.info("target is OUT, list targets");
                connections = gIO.getConnectionsFrom(e.target);
                log.obj(connections);
            } else {
                log.info("target is IN, list sources:");
                connections = gIO.getConnectionsTo(e.target);
                log.obj(connections);
            }
            
        };
    },
    
    init: function (target, scomp, isOut, type) {
        target.className = "ioport";

        if (isOut) {
            target.className += " ioport-out";
        } else {
            target.className += " ioport-in";
        }
        target.ioPort = scomp;
        target.isOut = isOut;
        target.ioType = type || "";
        
        gIO.addMouseEventsToPort(target);
    },

    make: function (scomp, isOut, type) {
        var ioport = document.createElement("div");
        gIO.init(ioport, scomp, isOut, type);
        return ioport;
    },
    
    makeIn: function (scomp, type) {
        return gIO.make(scomp, false, type);
    },
    
    makeOut: function (scomp, type) {
        return gIO.make(scomp, true, type);
    }
};