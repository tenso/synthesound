"use strict";
/*global gIO*/

function ioPort(sCUid, sComp, isOut, portName, portType) {
    var that = document.createElement("div");
    
    that.className = "ioport";

    if (isOut) {
        that.className += " ioport-out";
    } else {
        that.className += " ioport-in";
    }
    that.sCUid = sCUid;
    that.sComp = sComp;
    that.isOut = isOut;
    that.portName = portName;
    that.portType = portType || "";
    that.isIOPort = true;

    that.data = function () {
        return {
            sCUid: that.sCUid,
            isOut: that.isOut,
            portName: that.portName,
            portType: that.portType
        };
    };
    
    gIO.addMouseEventsToPort(that);
    return that;
}

function inPort(sCUid, sComp, portName, portType) {
    return ioPort(sCUid, sComp, false, portName, portType);
}

function outPort(sCUid, sComp, portName, portType) {
    return ioPort(sCUid, sComp, true, portName, portType);
}