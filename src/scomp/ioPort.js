"use strict";
/*global gIO*/
/*global gBase*/

function ioPort(uid, sComp, isOut, portName, portType) {
    var that = gBase();

    that.data = function () {
        return {
            uid: that.uid,
            isOut: that.isOut,
            portName: that.portName,
            portType: that.portType
        };
    };

    that.className = "ioport";
    if (isOut) {
        that.className += " ioport-out";
    } else {
        that.className += " ioport-in";
    }

    that.typeIs = "ioPort";
    that.uid = uid;
    that.sComp = sComp;
    that.isOut = isOut;
    that.portName = portName;
    that.portType = portType || "";
    that.isIOPort = true;

    gIO.addMouseEventsToPort(that);
    return that;
}

function inPort(uid, sComp, portName, portType) {
    return ioPort(uid, sComp, false, portName, portType);
}

function outPort(uid, sComp, portName, portType) {
    return ioPort(uid, sComp, true, portName, portType);
}
