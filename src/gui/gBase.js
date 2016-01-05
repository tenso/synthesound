"use strict";
/*global gui*/
/*global document*/

/*NOTE: cant use getW/getX etc functions unless element as already in the DOM*/

function gBase(type) {
    var that = document.createElement(type || "div"),
        originalColor,
        hoverColor,
        pressColor,
        originalPressColor,
        oldDisplay;

    that.show = function (value) {
        if (!value && that.style.display !== "none") {
            oldDisplay = that.style.display;
            that.style.display = "none";
        } else if (value && that.style.display === "none") {
            that.style.display = oldDisplay;
        }

        return that;
    };

    that.text = function (label) {
        that.textContent = label;
        return that;
    };

    that.display = function (value) {
        that.style.display = value;
        oldDisplay = that.style.display;

        return that;
    };

    that.padding = function (value) {
        return gui.stylePxIfInt(that, "padding", value);
    };

    that.paddingLeft = function (value) {
        return gui.stylePxIfInt(that, "paddingLeft", value);
    };

    that.paddingRight = function (value) {
        return gui.stylePxIfInt(that, "paddingRight", value);
    };

    that.margin = function (value) {
        return gui.stylePxIfInt(that, "margin", value);
    };

    that.marginLeft = function (value) {
        return gui.stylePxIfInt(that, "marginLeft", value);
    };

    that.marginRight = function (value) {
        return gui.stylePxIfInt(that, "marginRight", value);
    };

    that.lineHeight = function (value) {
        return gui.stylePxIfInt(that, "lineHeight", value);
    };

    //normal, nowrap, pre-line, ...
    that.whiteSpace = function (value) {
        that.style.whiteSpace = value;
        return that;
    };

    that.move = function (x, y) {
        gui.stylePxIfInt(that, "left", x);
        gui.stylePxIfInt(that, "top", y);
        return that;
    };

    that.z = function (value) {
        that.style.zIndex = value;
        return that;
    };

    that.overflow = function (value) {
        that.style.overflow = value;
        return that;
    };

    that.abs = function () {
        return that.pos("absolute");
    };

    that.pos = function (pos) {
        that.style.position = pos;
        return that;
    };

    that.left = function (value) {
        return gui.stylePxIfInt(that, "left", value);
    };

    that.getLeft = function () {
        return that.offsetLeft;
    };

    that.x = function (value) {
        return that.left(value);
    };

    that.getX = function () {
        return that.getLeft();
    };

    that.right = function (value) {
        return gui.stylePxIfInt(that, "right", value);
    };

    that.getRight = function () {
        return gui.getStyleInt(that, "right") || that.getX() + that.getW();
    };

    that.top = function (value) {
        return gui.stylePxIfInt(that, "top", value);
    };

    that.getTop = function () {
        return that.offsetTop;
    };

    that.y = function (value) {
        return that.top(value);
    };

    that.getY = function () {
        return that.getTop();
    };

    that.bottom = function (value) {
        return gui.stylePxIfInt(that, "bottom", value);
    };

    that.getBottom = function () {
        return gui.getStyleInt(that, "bottom") || that.getY() + that.getH();
    };

    that.w = function (value) {
        return gui.stylePxIfInt(that, "width", value);
    };

    that.getW = function () {
        return that.offsetWidth;
    };

    that.h = function (value) {
        return gui.stylePxIfInt(that, "height", value);
    };

    that.getH = function () {
        return that.offsetHeight;
    };

    that.minWidth = function (value) {
        return gui.stylePxIfInt(that, "minWidth", value);
    };

    that.minHeight = function (value) {
        return gui.stylePxIfInt(that, "minHeight", value);
    };

    that.setClass = function (className) {
        that.className = className;
        return that;
    };
    that.bg = function (value) {
        that.style.background = value;
        return that;
    };
    that.border = function (value) {
        that.style.border = value;
        return that;
    };
    that.borderColor = function (value) {
        that.style.borderColor = value;
        return that;
    };

    that.radius = function (value) {
        that.style.borderRadius = value + "px";
        return that;
    };

    that.color = function (value) {
        that.style.color = value;
        return that;
    };

    that.setSize = function (w, h) {
        gui.stylePxIfInt(that, "width", w);
        gui.stylePxIfInt(that, "height", h);
        return that;
    };

    that.fontSize = function (value) {
        return gui.stylePxIfInt(that, "fontSize", value);
    };

    that.fontFamily = function (value) {
        that.style.fontFamily = value;
        return that;
    };

    that.opacity = function (value) {
        that.style.opacity = value;
        return that;
    };

    function mouseEnterCallback() {
        originalColor = that.style.color;
        that.style.color = hoverColor || "#888";
    }

    function mouseLeaveCallback() {
        that.style.color = originalColor;
    }

    that.hoverEffect = function (value, color) {
        hoverColor = color;
        if (value) {
            that.addEventListener("mouseenter", mouseEnterCallback);
            that.addEventListener("mouseleave", mouseLeaveCallback);
        } else {
            that.removeEventListener("mouseenter", mouseEnterCallback);
            that.removeEventListener("mouseleave", mouseLeaveCallback);
        }

        return that;
    };

    function mouseDownCallback() {
        originalPressColor = that.style.color;
        that.style.color = pressColor || "#888";
    }

    function mouseUpCallback() {
        that.style.color = originalPressColor;
    }

    that.pressEffect = function (value, color) {
        pressColor = color;
        if (value) {
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

    that.float = function (value) {
        that.style.float = value;
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

    that.textAlign = function (value) {
        that.style.textAlign = value;
        return that;
    };

    that.typeIs = "gBase";
    that.typeClass = "gBase";

    return that;
}
