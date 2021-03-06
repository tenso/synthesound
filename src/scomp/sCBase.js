/*jslint node: true */

/*global gWidget*/
/*global inPort*/
/*global outPort*/
/*global gIO*/
/*global log*/
/*global uidGen*/
/*global lang*/
/*global sSequence*/
/*global util*/
/*global event*/

"use strict";

//FIXME: rename all sC to sG
var scBaseUID = uidGen();

var sCGlobal = event({
    current: undefined,
    recordingOn: false
});

function sCBase(container, type, sComp, uid) {
    var that = gWidget(),
        ports = [],
        myUID,
        saveAtMs = 0,
        seq,
        guiControls,
        stateMode = "";

    function makeRemoveAllConnections() {
        return function () {
            gIO.delAllConnectionsToAndFromUID(that.uid());
            that.emit("removeOutput", sComp);
            if (sCGlobal.current === that) {
                sCGlobal.current = undefined;
                sCGlobal.emit("currentUpdated", sCGlobal.current);
            }
        };
    }

    function setGuiControlAfterArg(args) {
        var arg;

        if (guiControls) {
            for (arg in args) {
                if (args.hasOwnProperty(arg)) {
                    if (guiControls.hasOwnProperty(arg)) {
                        guiControls[arg].setValue(args[arg], true);
                    }
                }
            }
        }
    }

    function initStates() {
        seq = sSequence(sComp, setGuiControlAfterArg);
    }

    that.on("selected", function () {
        if (sCGlobal.current === that) {
            return;
        }

        if (sCGlobal.current) {
            sCGlobal.current.unselect();
        }
        sCGlobal.current = that;
        sCGlobal.current.select();

        sCGlobal.emit("currentUpdated", sCGlobal.current);
    });

    that.iWasMoved = function (obj) {
        util.unused(obj);
        gIO.drawConnections();
    };

    that.select = function () {
        that.setBorder("2px solid #8f8");
    };

    that.unselect = function () {
        that.setBorder("2px solid #fff");
    };

    that.setAndSaveArgs = function (args, isDuration, open) {
        //FIXME: should not seq.saveAt() trigger update of states?
        seq.setArgs(args);
        if (that === sCGlobal.current) {
            sCGlobal.emit("currentUpdatedState", sCGlobal.current);
        }
        if (sCGlobal.recordingOn) {
            if (isDuration) {
                if (open) {
                    seq.openAt(saveAtMs);
                } else {
                    if (seq.openStep()) {
                        seq.closeAt();
                    } else {
                        log.error("sCBase.setAndSaveArgs: no open step");
                    }

                }
            } else {
                seq.saveAt(saveAtMs);
            }
        }
    };

    that.setGuiControls = function (controls) {
        guiControls = controls;
    };

    //FIXME: mixin uid functions?
    that.uid = function () {
        return myUID;
    };

    that.type = function () {
        return that.typeIs;
    };

    that.setArgs = function (sArgs) {
        if (sArgs) {
            seq.load(sArgs);
            setGuiControlAfterArg(sArgs.args);
        }
    };

    that.stateMode = function () {
        return stateMode;
    };

    that.setStateMode = function (mode) {
        stateMode = mode;
    };

    that.getSequencer = function () {
        return seq;
    };

    that.addIn = function (type) {
        var port = inPort(that.uid(), sComp, type);
        that.addTabled(port, type || "in");
        ports.push(port);
        return that;
    };

    that.addOut = function (type) {
        var port = outPort(that.uid(), sComp, type);
        that.addTabled(port, type || "out");
        ports.push(port);
        return that;
    };

    that.data = function () {
        return {
            type: type,
            uid: that.uid(),
            x: that.getX(),
            y: that.getY(),
            sComp: {
                type: sComp.typeId()
            },
            sArgs: seq.data()
        };
    };

    that.getPort = function (isOut, type) {
        var i;

        for (i = 0; i < ports.length; i += 1) {
            if (ports[i].isOut === isOut && ports[i].portType === type) {
                return ports[i];
            }
        }
        log.error("could not find port");
        return undefined;
    };

    that.setCurrentMs = function (ms, saveMs) {
        if (typeof ms !== "number" || isNaN(ms)) {
            log.error("scBase.setCurrentMs: ms not a number");
            return;
        }
        seq.moveToMs(ms);
        saveAtMs = saveMs > 0 ? saveMs : 0;
    };

    that.saveArgs =  function (ms) {
        seq.saveAt(ms);
        return that;
    };

    that.saveInitialArgs =  function () {
        if (!seq.hasArgAt(0)) {
            seq.saveAt(0);
        }
        return that;
    };

    that.setTitle(lang.tr(type));
    that.addRemove();
    that.on("removed", makeRemoveAllConnections());
    container.add(that);

    if (typeof uid === "number") {
        myUID = uid;
    } else {
        myUID = scBaseUID.getUID();
    }

    initStates();
    that.typeClass = "sCBase";
    that.typeIs = type || "sCBase";

    return that;
}
