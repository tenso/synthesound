"use strict";
/*global logInfo*/

function connectAllPorts() {
    var ioports = document.getElementsByClassName("io-port"),
        i;

    logInfo("connecting " + ioports.length + " ports");
    for (i = 0; i < ioports.length; i += 1) {
        ioports[i].onmousedown = function(e) {
            console.log("capture:" + e.target.id); 
            setMouseCapturer(e);
        }
        ioports[i].onmousepressandmove = function(e) {
            console.log("move from:" + e.mouseCapturer.id + " x:" + e.screenX + "  y:" + e.screenY);
        }
        ioports[i].onmouseupaftercapture = function(e) {
            console.log("release from:" + e.mouseCapturer.id + " to:" + e.target.id + " x:" + e.screenX + "  y:" + e.screenY);
        }
    }
}

function GIO() {
    
}
