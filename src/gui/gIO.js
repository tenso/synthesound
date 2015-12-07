"use strict";
/*global log*/
/*global input*/
/*global gui*/
/*global gMenu*/

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
    delConnection: function (p1, p2) {
        var from,
            to,
            i;
        
        if (p1.isOut) {
            from = p1;
            to = p2;
        } else {
            from = p2;
            to = p1;
        }
        to.ioPort.delInput(from.ioPort, to.ioType);
        
        for (i = 0; i < gIO.connections.length; i += 1) {
            if (gIO.connections[i].from === from && gIO.connections[i].to === to) {
                gIO.connections.splice(i, 1);
                gIO.drawConnections();
                break;
            }
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
            var connections,
                menu,
                i;
            
            function makeDelCb(menu, port1, port2) {
                return function () {
                    gIO.delConnection(port1, port2);
                    menu.remove();
                };
            }
            
            if (!e.target.ioPort) {
                log.error("no ioPort found");
                return;
            }
            
            if (e.target.isOut) {
                connections = gIO.getConnectionsFrom(e.target);
            } else {
                connections = gIO.getConnectionsTo(e.target);
            }
            
            if (connections.length) {
                menu = gMenu(document.body);

                for (i = 0; i < connections.length; i += 1) {
                    menu.add(e.target.ioPort.title + " > "
                             + connections[i].ioPort.title + " "
                             + connections[i].ioType + " "
                             + (connections[i].isOut ? "out" : "in"), makeDelCb(menu, e.target, connections[i]));
                }
                menu.move(e.pageX - 20, e.pageY - 20);
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