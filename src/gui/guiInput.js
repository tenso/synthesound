"use strict";
/*global test*/
/*global log*/
/*global gui*/

function guiInput(container, sizeOfContainerChanged) {
    var that = {},
        keyIsDown = 0,
        mouseCapturer = 0,
        keyCapturer = 0,
        mouse = {},
        oldSize = {w: 0, h: 0};
    
    function setMouseFromEvent(e) {
        mouse.x = e.pageX + container.scrollLeft;
        mouse.y = e.pageY + container.scrollTop;
        mouse.relativeX = mouse.x - mouse.captureOffsetInElement.x;
        mouse.relativeY = mouse.y - mouse.captureOffsetInElement.y;
    }
    
    function runCaptureCBIfExist(name, e) {
        setMouseFromEvent(e);

        if (mouseCapturer && mouseCapturer.hasOwnProperty(name)) {
            e.mouseCapturer = mouseCapturer;
            mouseCapturer[name](e, mouse);
        }
    }
    
    function runCBIfExist(name, e) {
        setMouseFromEvent(e);
        
        if (e.target.hasOwnProperty(name)) {
            e.target[name](e, mouse);
        }
    }
    
    function setMouseCaptureFromEvent(e, target) {
        mouse.captureOffsetInElement = gui.getEventOffsetInElement(target, e);
        mouse.captureOffsetInElement.x += container.scrollLeft;
        mouse.captureOffsetInElement.y += container.scrollTop;
        mouse.captureX = e.pageX + container.scrollLeft;
        mouse.captureY = e.pageY + container.scrollTop;
    }
    
    function checkSize(container) {
        var newSize = {w: container.scrollWidth, h: container.scrollHeight};
        
        if (newSize.w !== oldSize.w
                || newSize.h !== oldSize.h) {
            oldSize = newSize;
            if (sizeOfContainerChanged) {
                sizeOfContainerChanged(newSize);
            }
        }
    }
    
    that.setMouseCapturer = function (e, wantedObject) {
        e.stopPropagation();
        if (!wantedObject) {
            mouseCapturer = e.target;
        } else {
            mouseCapturer = wantedObject;
        }
        setMouseCaptureFromEvent(e, mouseCapturer);
        runCaptureCBIfExist("iMouseCaptured", e);
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
    
    document.addEventListener("mouseup", function (e) {
        if (mouseCapturer) {
            runCaptureCBIfExist("iMouseUpAfterCapture", e);
            mouseCapturer = undefined;
        }
    });

    document.addEventListener("mousemove", function (e) {
        if (mouseCapturer) {
            runCaptureCBIfExist("iMousePressAndMove", e);
            checkSize(container);
        }
    });

    document.addEventListener("mouseover", function (e) {
        if (mouseCapturer) {
            runCaptureCBIfExist("iMouseOverAfterCapture", e);
        }
    });

    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        //NOTE: dont set  captured here: will send all sorts of events...
        setMouseCaptureFromEvent(e, e.target);
        runCBIfExist("iOpenContextMenu", e);
    });
    
    document.addEventListener("keydown", function (e) {
        if (keyCapturer) {
            if (keyCapturer.iKeyDown) {
                var key = String.fromCharCode(e.keyCode).toLowerCase();

                if (keyIsDown === key) {
                    return;
                }
                keyIsDown = key;
                keyCapturer.iKeyDown(key, e.shiftKey);
            }
        }
    }, false);
    
    document.addEventListener("keyup", function (e) {
        if (keyCapturer) {
            if (keyCapturer.iKeyUp) {
                var key = String.fromCharCode(e.keyCode).toLowerCase();

                if (keyIsDown !== key) {
                    return;
                }
                keyIsDown = 0;
                keyCapturer.iKeyUp(key, e.shiftKey);
            }
        }
    }, false);
    
    return that;
}