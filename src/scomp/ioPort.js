"use strict";
/*global gIO*/

function ioPort(sComp, isOut, special) {
    var that = document.createElement("div");
    
    that.className = "ioport";

    if (isOut) {
        that.className += " ioport-out";
    } else {
        that.className += " ioport-in";
    }
    that.sComp = sComp;
    that.isOut = isOut;
    that.ioType = special || "";

    gIO.addMouseEventsToPort(that);
    return that;
}

function inPort(sComp, special) {
    return ioPort(sComp, false, special);
}

function outPort(sComp, special) {
    return ioPort(sComp, true, special);
}