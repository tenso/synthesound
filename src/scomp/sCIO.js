"use strict";
/*global log*/
/*global gui*/
/*global wMenu*/
/*global ioCon*/

function sCIO(container) {
    var that = {},
        linesCanvas = document.createElement("canvas"),
        linesCtx,
        connections = [];
    
    container.appendChild(linesCanvas);
    linesCanvas.className = "gIOCanvas";
    linesCtx = linesCanvas.getContext("2d");
    linesCtx.strokeStyle = "#000";
    linesCtx.lineWidth = 2;

    function drawLine(fromX, fromY, toX, toY) {
        linesCtx.beginPath();
        linesCtx.moveTo(fromX, fromY);
        linesCtx.lineTo(toX, toY);
        linesCtx.stroke();
    }

    that.drawConnections = function () {
        var i,
            to,
            from;

        if (!linesCtx) {
            return;
        }
        
        linesCtx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);

        for (i = 0; i < connections.length; i += 1) {
            to = connections[i].to();
            from = connections[i].from();
            drawLine(gui.getPos(from).x + gui.getSize(from).w / 2,
                         gui.getPos(from).y + gui.getSize(from).h / 2,
                         gui.getPos(to).x + gui.getSize(to).w / 2,
                         gui.getPos(to).y + gui.getSize(to).h / 2);
        }
    };
            
    function haveConnection(from, to) {
        var i;
        for (i = 0; i < connections.length; i += 1) {
            if (connections[i].from() === from && connections[i].to() === to) {
                return true;
            }
        }
        return false;
    }

    function getConnectionsFrom(ioPort) {
        var i,
            ret = [];
        
        for (i = 0; i < connections.length; i += 1) {
            if (connections[i].from() === ioPort) {
                ret.push(connections[i].to());
            }
        }
        return ret;
    }
    
    function getConnectionsTo(ioPort) {
        var i,
            ret = [];
        
        for (i = 0; i < connections.length; i += 1) {
            if (connections[i].to() === ioPort) {
                ret.push(connections[i].from());
            }
        }
        return ret;
    }

    that.resizeCanvas = function () {
        var workspaceWidth = container.scrollWidth,
            workspaceHeight = container.scrollHeight;
        
        linesCanvas.width = workspaceWidth;
        linesCanvas.height = workspaceHeight;
        linesCanvas.style.width = workspaceWidth;
        linesCanvas.style.height = workspaceHeight;
        that.drawConnections();
    };
    
    that.data = function () {
        var ret = [],
            i;
        for (i = 0; i < connections.length; i += 1) {
            ret.push(connections[i].data());
        }
        return ret;
    };
    
    that.connectPorts = function (p1, p2) {
        var from,
            to,
            con;
        
        if (p1.sComp && p2.sComp) {
            if (p1.isOut === p2.isOut) {
                log.error("connection is not from out to in");
                that.drawConnections();
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
                that.drawConnections();
                return false;
            }
            if (haveConnection(from, to)) {
                log.warn("already have connection");
                that.drawConnections();
                return false;
            }
            
            con = ioCon(to, from);
            connections.push(con);

            to.sComp.addInput(from.sComp, to.portType);
            that.drawConnections();
            return true;
        } else {
            log.error("cant connect to non port(s)");
        }
        return false;
    };
    
    that.delConnection = function (p1, p2) {
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
        
        for (i = 0; i < connections.length; i += 1) {
            if (connections[i].from() === from && connections[i].to() === to) {
                connections.splice(i, 1);
                that.drawConnections();
                break;
            }
        }
    };
    
    that.delAllConnectionsToAndFromUID = function (uid) {
        var i;
        for (i = 0; i < connections.length; i += 0) {
            if (connections[i].from().uid === uid || connections[i].to().uid === uid) {
                that.delConnection(connections[i].from(), connections[i].to());
            } else {
                i += 1;
            }
        }
        that.drawConnections();
    };
    
    that.addMouseEventsToPort = function (port) {

        port.onmousedown = function (e) {
            if (e.button === 0) {
                if (e.target.sComp) {
                    gui.captureMouse(e);
                }
            }
        };
        
        port.iMousePressAndMove = function (e, mouse) {
            that.drawConnections();
            drawLine(mouse.captureX, mouse.captureY, mouse.x, mouse.y);
        };
        
        port.iMouseUpAfterCapture = function (e) {
            if (e.target.sComp) {
                that.connectPorts(e.mouseCapturer, e.target);
            } else {
                that.drawConnections();
            }
        };
        
        port.iOpenContextMenu = function (e, mouse) {
            var connections,
                menu,
                i;
            
            function makeDelCb(menu, port1, port2) {
                return function () {
                    that.delConnection(port1, port2);
                    menu.remove();
                };
            }
            
            if (!e.target.sComp) {
                log.error("no sComp found");
                return;
            }
            
            if (e.target.isOut) {
                connections = getConnectionsFrom(e.target);
            } else {
                connections = getConnectionsTo(e.target);
            }
            
            if (connections.length) {
                menu = wMenu(container).move(mouse.x - 20, mouse.y - 20);

                for (i = 0; i < connections.length; i += 1) {
                    menu.add(e.target.sComp.typeId() + " > "
                             + connections[i].sComp.typeId() + " "
                             + connections[i].portType + " "
                             + (connections[i].isOut ? "out" : "in"), makeDelCb(menu, e.target, connections[i]));
                }
            }
        };
    };
    
    that.resizeCanvas();
    
    return that;
}