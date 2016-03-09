/*jslint node: true */

/*global test*/
/*global log*/
/*global gui*/
/*global document*/

"use strict";

//FIXME: remove container, make it transparent to "container"
//NOTE: mouse is relative to container, dont use for nodes not in container.
function guiInput(container) {
    var that = {},
        keyIsDown = 0,
        mouseCapturer,
        prevMouseCapturer,
        keyCapturer,
        mouse = {},
        oldSize = {w: 0, h: 0};

    function setMouseFromEvent(e, target) {
        mouse.x = gui.getEventOffsetInElement(container,  e).x;
        mouse.y = gui.getEventOffsetInElement(container,  e).y;
        mouse.relative = {
            x: mouse.x - mouse.captureOffsetInElement.x,
            y: mouse.y - mouse.captureOffsetInElement.y
        };
        mouse.change = {
            x: mouse.x - mouse.capture.x,
            y: mouse.y - mouse.capture.y
        };

        if (target) {
            mouse.offsetInElement = gui.getEventOffsetInElement(target, e);
            mouse.offsetInParent = gui.getEventOffsetInElement(target.parentNode, e);
        }
    }

    function sendEvent(name, e) {
        if (mouseCapturer) {
            setMouseFromEvent(e, mouseCapturer);
            e.mouseCapturer = mouseCapturer;
            if (!mouseCapturer.emit) {
                log.error("mouseCapturer does not seem to be event type, event:" + name);
            } else {
                mouseCapturer.emit(name, e, mouse);
            }
        }
    }

    function setMouseCaptureFromEvent(e, target) {
        mouse.captureOffsetInElement = gui.getEventOffsetInElement(target, e);
        mouse.capture = gui.getEventOffsetInElement(container, e);
    }

    that.setMouseCapturer = function (e, wantedObject) {
        e.stopPropagation();

        if (!wantedObject) {
            mouseCapturer = e.target;
        } else {
            mouseCapturer = wantedObject;
        }

        if (prevMouseCapturer) {
            prevMouseCapturer = undefined;
        }

        setMouseCaptureFromEvent(e, mouseCapturer);
        sendEvent("mouseCaptured", e);
        if (!mouseCapturer.emit) {
            log.error("mouseCapturer is not event type");
        } else {
            mouseCapturer.emit("selected");
        }
    };

    that.setKeyCapturer = function (e, wantedObject) {
        if (e) {
            e.stopPropagation();
        }
        if (!wantedObject) {
            keyCapturer = e.target;
        } else {
            keyCapturer = wantedObject;
        }
    };

    that.mouseOver = undefined;

    document.addEventListener("mouseup", function (e) {
        if (mouseCapturer) {
            sendEvent("mouseUpAfterCapture", e);
            prevMouseCapturer = mouseCapturer;
            mouseCapturer = undefined;
        }
    });

    document.addEventListener("mousemove", function (e) {
        if (mouseCapturer) {
            sendEvent("mousePressAndMove", e);

            if (typeof mouseCapturer.iWasMoved === "function") {
                mouseCapturer.iWasMoved(mouseCapturer);
            }
        }
    });

    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        //NOTE: dont set  captured here: will send all sorts of events...
        setMouseCaptureFromEvent(e, e.target);
        setMouseFromEvent(e, e.target);
        if (e.target) {
            if (!e.target.emit) {
                log.error("target is not event type: trying to open context menu");
            } else {
                e.target.emit("openContextMenu", e, mouse);
            }
        }
    });

    document.addEventListener("keydown", function (e) {
        if (keyCapturer) {
            var key = String.fromCharCode(e.keyCode).toLowerCase();

            if (keyIsDown === key) {
                return;
            }
            keyIsDown = key;
            if (!keyCapturer.emit) {
                log.error("keyCapturer is not event type: keyDown");
            } else {
                keyCapturer.emit("keyDown", key, e.shiftKey);
            }
        }
    }, false);

    document.addEventListener("keyup", function (e) {
        if (keyCapturer) {

            var key = String.fromCharCode(e.keyCode).toLowerCase();

            if (keyIsDown !== key) {
                return;
            }
            keyIsDown = 0;
            if (!keyCapturer.emit) {
                log.error("keyCapturer is not event type: keyUp");
            } else {
                keyCapturer.emit("keyUp", key, e.shiftKey);
            }
        }
    }, false);

    return that;
}
