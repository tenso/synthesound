"use strict";
/*global log*/
/*global input*/
/*global gui*/
/*global wMenu*/
/*global ioCon*/

var gIO = {
    linesCanvas: undefined,
    linesCtx: undefined,
    connections: [],
    container: undefined,

    drawLine: function (fromX, fromY, toX, toY) {
        gIO.linesCtx.beginPath();
        gIO.linesCtx.moveTo(fromX, fromY);
        gIO.linesCtx.lineTo(toX, toY);
        gIO.linesCtx.stroke();
    },

    drawConnections: function () {
        var i,
            to,
            from;

        if (!gIO.linesCtx) {
            return;
        }
        
        gIO.linesCtx.clearRect(0, 0, gIO.linesCanvas.width, gIO.linesCanvas.height);

        for (i = 0; i < gIO.connections.length; i += 1) {
            to = gIO.connections[i].to();
            from = gIO.connections[i].from();
            gIO.drawLine(gui.getPos(from).x + gui.getSize(from).w / 2,
                         gui.getPos(from).y + gui.getSize(from).h / 2,
                         gui.getPos(to).x + gui.getSize(to).w / 2,
                         gui.getPos(to).y + gui.getSize(to).h / 2);
        }
    },
    
    resizeCanvas: function () {
        var workspaceWidth = gIO.container.scrollWidth,
            workspaceHeight = gIO.container.scrollHeight;
        
        gIO.linesCanvas.width = workspaceWidth;
        gIO.linesCanvas.height = workspaceHeight;
        gIO.linesCanvas.style.width = workspaceWidth;
        gIO.linesCanvas.style.height = workspaceHeight;
        gIO.drawConnections();
    },
    
    init: function (container) {
        var i;
            
        gIO.container = container;
        gIO.linesCanvas = document.createElement("canvas");
        gIO.container.appendChild(gIO.linesCanvas);
        gIO.linesCanvas.className = "gIOCanvas";
        gIO.linesCtx = gIO.linesCanvas.getContext("2d");
        gIO.linesCtx.strokeStyle = "#000";
        gIO.linesCtx.lineWidth = 2;
              
        gIO.resizeCanvas();
    },
    
    haveConnection: function (from, to) {
        var i;
        for (i = 0; i < gIO.connections.length; i += 1) {
            if (gIO.connections[i].from() === from && gIO.connections[i].to() === to) {
                return true;
            }
        }
        return false;
    },
    
    data: function () {
        var ret = [],
            i;
        for (i = 0; i < gIO.connections.length; i += 1) {
            ret.push(gIO.connections[i].data());
        }
        return ret;
    },
    
    getConnectionsFrom: function (ioPort) {
        var i,
            connections = [];
        
        for (i = 0; i < gIO.connections.length; i += 1) {
            if (gIO.connections[i].from() === ioPort) {
                connections.push(gIO.connections[i].to());
            }
        }
        return connections;
    },
    
    getConnectionsTo: function (ioPort) {
        var i,
            connections = [];
        
        for (i = 0; i < gIO.connections.length; i += 1) {
            if (gIO.connections[i].to() === ioPort) {
                connections.push(gIO.connections[i].from());
            }
        }
        return connections;
    },
    
    connectPorts: function (p1, p2) {
        var from,
            to,
            con;
        
        if (p1.sComp && p2.sComp) {
            if (p1.isOut === p2.isOut) {
                log.error("connection is not from out to in");
                return false;
            }
            
            if (p1.isOut) {
                from = p1;
                to = p2;
            } else {
                from = p2;
                to = p1;
            }
               
            if (from.sComp === to.sComp) {
                log.warn("inter component feedback not allowed");
                gIO.drawConnections();
                return false;
            }
            if (gIO.haveConnection(from, to)) {
                log.warn("already have connection");
                gIO.drawConnections();
                return false;
            }
            
            con = ioCon(to, from);
            gIO.connections.push(con);

            to.sComp.addInput(from.sComp, to.portType);
            gIO.drawConnections();
            return true;
        } else {
            log.error("cant connect to non port(s)");
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
        
        to.sComp.delInput(from.sComp, to.portType);
        
        for (i = 0; i < gIO.connections.length; i += 1) {
            if (gIO.connections[i].from() === from && gIO.connections[i].to() === to) {
                gIO.connections.splice(i, 1);
                gIO.drawConnections();
                break;
            }
        }
    },
    
    delAllConnectionsToAndFromUID: function (uid) {
        var i;
        for (i = 0; i < gIO.connections.length; i += 0) {
            if (gIO.connections[i].from().uid === uid || gIO.connections[i].to().uid === uid) {
                gIO.delConnection(gIO.connections[i].from(), gIO.connections[i].to());
            } else {
                i += 1;
            }
        }
        gIO.drawConnections();
    },
    
    addMouseEventsToPort: function (port) {

        port.onmousedown = function (e) {
            if (e.button === 0) {
                if (e.target.sComp && e.target.isOut) {
                    input.setMouseCapturer(e);
                }
            }
        };
        
        port.iMousePressAndMove = function (e, mouse) {
            gIO.drawConnections();
            gIO.drawLine(mouse.captureX, mouse.captureY, mouse.x, mouse.y);
        };
        
        port.iMouseUpAfterCapture = function (e) {
            if (e.target.sComp && !e.target.isOut) {
                gIO.connectPorts(e.mouseCapturer, e.target);
            } else {
                gIO.drawConnections();
            }
        };
        
        port.iOpenContextMenu = function (e, mouse) {
            var connections,
                menu,
                i;
            
            function makeDelCb(menu, port1, port2) {
                return function () {
                    gIO.delConnection(port1, port2);
                    menu.remove();
                };
            }
            
            if (!e.target.sComp) {
                log.error("no sComp found");
                return;
            }
            
            if (e.target.isOut) {
                connections = gIO.getConnectionsFrom(e.target);
            } else {
                connections = gIO.getConnectionsTo(e.target);
            }
            
            if (connections.length) {
                menu = wMenu(gIO.container).move(mouse.x - 20, mouse.y - 20);

                for (i = 0; i < connections.length; i += 1) {
                    menu.add(e.target.sComp.typeId() + " > "
                             + connections[i].sComp.typeId() + " "
                             + connections[i].portType + " "
                             + (connections[i].isOut ? "out" : "in"), makeDelCb(menu, e.target, connections[i]));
                }
            }
        };
    }
};