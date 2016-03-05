/*jslint node: true */

/*global gStyle*/
/*global log*/

"use strict";

/*NOTE: cant use getW/getX etc functions unless element as already in the DOM or has explicit w/h set*/

function gBase(type) {
    var that = gStyle(type),
        hoverStyle,
        pressStyle,
        isDown = false,
        stopPropagation = false;

    function mouseEnterCallback(e) {
        that.emit("enter");
        if (hoverStyle) {
            that.setStyleStateChanges(hoverStyle);
            that.pushStyle();
        }
    }

    function mouseLeaveCallback(e) {
        that.emit("leave", e);
        if (hoverStyle) {
            that.popStyle();
        }
    }

    function mouseDownCallback(e) {
        that.emit("pressed", e);
        if (isDown) {
            log.error("gBase.mouseDownCallback: already down");
            return;
        }
        isDown = true;
        if (stopPropagation) {
            e.stopPropagation();
        }
        if (pressStyle) {
            that.setStyleStateChanges(pressStyle);
            that.pushStyle();
        }
    }

    function mouseUpCallback(e) {
        that.emit("released", e);
        if (!isDown) {
            return;
        }
        isDown = false;
        if (pressStyle) {
            that.popStyle();
        }
    }


    that.hoverEffect = function (style) {
        hoverStyle = style;
        return that;
    };

    that.pressEffect = function (style) {
        pressStyle = style;
        return that;
    };

    that.addAt = function (element, x, y) {
        element.abs().moveTo(x, y);
        that.appendChild(element);
        return that;
    };

    that.add = function (element) {
        that.appendChild(element);
        return that;
    };

    that.undoAdd = function (element) {
        that.removeChild(element);
        return that;
    };

    that.addTo = function (element) {
        element.appendChild(that);
        return that;
    };

    that.remove = function () {
        that.emit("removed");
        if (that.parentNode) {
            that.parentNode.removeChild(that);
        }
        return that;
    };

    that.gParent = function () {
        if (that.parentNode) {
            if (that.parentNode.gParent) {
                return that.parentNode.gParent();
            }
        }
        return that;
    };

    that.selectParent = function () {
        if (that.gParent) {
            that.gParent().emit("selected");
        }
        return that;
    };

    that.stopPropagation = function (value) {
        stopPropagation = value;
        return that;
    };

    that.setType = function (value) {
        that.type = value;
        return that;
    };

    that.typeIs = "gBase";
    that.typeClass = "gBase";
    that.cursor("default");

    that.addEventListener("mousedown", mouseDownCallback);
    that.addEventListener("mouseup", mouseUpCallback);
    that.addEventListener("mouseleave", mouseUpCallback);
    that.addEventListener("mouseenter", mouseEnterCallback);
    that.addEventListener("mouseleave", mouseLeaveCallback);
    return that;
}
