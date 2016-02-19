/*jslint node: true */

/*global gIO*/
/*global gBase*/

"use strict";

function ioPort(uid, sComp, isOut, portType) {
    var that = gBase();

    that.data = function () {
        return {
            uid: that.uid,
            isOut: that.isOut,
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
    that.portType = portType || "";
    that.isIOPort = true;

    gIO.addMouseEventsToPort(that);
    return that;
}

function inPort(uid, sComp, portType) {
    return ioPort(uid, sComp, false, portType);
}

function outPort(uid, sComp, portType) {
    return ioPort(uid, sComp, true, portType);
}
