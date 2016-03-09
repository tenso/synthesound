/*jslint node: true */

/*global log*/
/*global gui*/
/*global wMenu*/
/*global ioCon*/
/*global gBase*/
/*global util*/

"use strict";

function sCIO() {
    var that = gBase("canvas"),
        linesCtx,
        connections = [],
        scroll = {
            x: 0,
            y: 0
        };

    function drawLine(fromX, fromY, toX, toY) {
        linesCtx.beginPath();
        linesCtx.moveTo(fromX - scroll.x, fromY - scroll.y);
        linesCtx.lineTo(toX - scroll.x, toY - scroll.y);
        linesCtx.stroke();
    }

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

    that.drawConnections = function () {
        var i,
            to,
            from,
            toSize,
            fromSize;

        if (!linesCtx) {
            return;
        }

        linesCtx.clearRect(0, 0, that.width, that.height);

        for (i = 0; i < connections.length; i += 1) {
            to = gui.getPos(connections[i].to());
            from = gui.getPos(connections[i].from());
            toSize = gui.getSize(connections[i].to());
            fromSize = gui.getSize(connections[i].from());
            drawLine(from.x + fromSize.w / 2 - that.getX(),
                     from.y + fromSize.h / 2  - that.getY(),
                     to.x + toSize.w / 2 - that.getX(),
                     to.y + toSize.h / 2  - that.getY());
        }
    };

    that.resize = function (w, h) {
        that.width = w - 21; //FIXME: hardcoded compenstation for scrollbars
        that.height = h - 21; //FIXME: hardcoded compenstation for scrollbars
        that.style.width = that.width + "px";
        that.style.height = that.height + "px";
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
            to.sComp.addInput(from.sComp, from.portType, to.portType);
            that.drawConnections();
            return true;
        }

        log.error("cant connect to non port(s)");
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

        to.sComp.delInput(from.sComp, from.portType, to.portType);

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

        port.on("mousePressAndMove", function (e, mouse) {
            util.unused(e);
            that.drawConnections();
            drawLine(gui.getPos(port).x + gui.getSize(port).w / 2 - that.getX(),
                     gui.getPos(port).y + gui.getSize(port).h / 2  - that.getY(),
                     mouse.x, mouse.y);
        });

        port.on("mouseUpAfterCapture", function (e) {
            if (e.target.sComp) {
                that.connectPorts(e.mouseCapturer, e.target);
            } else {
                that.drawConnections();
            }
        });

        port.on("openContextMenu", function (e, mouse) {
            var targetConnections,
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
                targetConnections = getConnectionsFrom(e.target);
            } else {
                targetConnections = getConnectionsTo(e.target);
            }

            if (targetConnections.length) {
                menu = wMenu().moveTo(e.pageX - 20, e.pageY - 10).z(200000);
                that.parentNode.add(menu);

                for (i = 0; i < targetConnections.length; i += 1) {
                    menu.addRow(e.target.sComp.typeId() + " > "
                             + targetConnections[i].sComp.typeId() + " "
                             + targetConnections[i].portType + " "
                             + (targetConnections[i].isOut ? "out" : "in"),
                                makeDelCb(menu, e.target, targetConnections[i]));
                }
            }
        });
    };

    that.scroll = function (x, y) {
        scroll.x = x;
        scroll.y = y;
        that.drawConnections();
        return that;
    };

    that.className = "gIOCanvas";
    linesCtx = that.getContext("2d");
    linesCtx.strokeStyle = "#000";
    linesCtx.lineWidth = 2;

    return that;
}
