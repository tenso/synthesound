"use strict";
/*global gStyle*/

/*NOTE: cant use getW/getX etc functions unless element as already in the DOM or has explicit w/h set*/



function gBase(type) {
    var that = gStyle(type),
        hoverStyle,
        pressStyle;

    function mouseEnterCallback() {
        if (hoverStyle) {
            that.setStyleStateChanges(hoverStyle);
            that.pushStyle();
        }
    }

    function mouseLeaveCallback() {
        if (hoverStyle) {
            that.popStyle();
        }
    }

    function mouseDownCallback() {
        if (pressStyle) {
            that.setStyleStateChanges(pressStyle);
            that.pushStyle();
        }
    }

    function mouseUpCallback() {
        if (pressStyle) {
            that.popStyle();
        }
    }


    that.hoverEffect = function (style) {
        hoverStyle = style;
        if (style) {
            that.addEventListener("mouseenter", mouseEnterCallback);
            that.addEventListener("mouseleave", mouseLeaveCallback);
        } else {
            that.removeEventListener("mouseenter", mouseEnterCallback);
            that.removeEventListener("mouseleave", mouseLeaveCallback);
        }

        return that;
    };

    that.pressEffect = function (style) {
        pressStyle = style;
        if (style) {
            that.addEventListener("mousedown", mouseDownCallback);
            that.addEventListener("mouseup", mouseUpCallback);
            that.addEventListener("mouseleave", mouseUpCallback);
        } else {
            that.removeEventListener("mousedown", mouseDownCallback);
            that.removeEventListener("mouseup", mouseUpCallback);
            that.removeEventListener("mouseleave", mouseUpCallback);
        }

        return that;
    };

    that.addAt = function (element, x, y) {
        element.abs().move(x, y);
        that.appendChild(element);
        return that;
    };

    that.add = function (element) {
        that.appendChild(element);
        return that;
    };

    that.addTo = function (element) {
        element.appendChild(that);
        return that;
    };

    that.remove = function () {
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
            if (that.gParent().iWasSelected) {
                that.gParent().iWasSelected();
            }
        }
        return that;
    };

    that.typeIs = "gBase";
    that.typeClass = "gBase";
    that.cursor("auto");

    return that;
}
