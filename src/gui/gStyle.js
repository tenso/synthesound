"use strict";
/*global gui*/
/*global util*/

function gStyle(type) {
    var that = document.createElement(type || "div"),
        oldDisplay;

    util.addMethod(that, "show", function (value) {
        if (!value && that.style.display !== "none") {
            oldDisplay = that.style.display;
            that.style.display = "none";
        } else if (value && that.style.display === "none") {
            that.style.display = oldDisplay;
        }

        return that;
    });

    util.addMethod(that, "text", function (label) {
        that.textContent = label;
        return that;
    });

    util.addMethod(that, "display", function (value) {
        that.style.display = value;
        oldDisplay = that.style.display;

        return that;
    });

    util.addMethod(that, "padding", function (value) {
        return gui.stylePxIfInt(that, "padding", value);
    });

    util.addMethod(that, "paddingLeft", function (value) {
        return gui.stylePxIfInt(that, "paddingLeft", value);
    });

    util.addMethod(that, "paddingRight", function (value) {
        return gui.stylePxIfInt(that, "paddingRight", value);
    });

    util.addMethod(that, "margin", function (value) {
        return gui.stylePxIfInt(that, "margin", value);
    });

    util.addMethod(that, "marginLeft", function (value) {
        return gui.stylePxIfInt(that, "marginLeft", value);
    });

    util.addMethod(that, "marginRight", function (value) {
        return gui.stylePxIfInt(that, "marginRight", value);
    });

    util.addMethod(that, "lineHeight", function (value) {
        return gui.stylePxIfInt(that, "lineHeight", value);
    });

    //normal, nowrap, pre-line, ...
    util.addMethod(that, "whiteSpace", function (value) {
        that.style.whiteSpace = value;
        return that;
    });

    util.addMethod(that, "move", function (x, y) {
        gui.stylePxIfInt(that, "left", x);
        gui.stylePxIfInt(that, "top", y);
        return that;
    });

    util.addMethod(that, "z", function (value) {
        that.style.zIndex = value;
        return that;
    });

    util.addMethod(that, "overflow", function (value) {
        that.style.overflow = value;
        return that;
    });

    util.addMethod(that, "overflowX", function (value) {
        that.style.overflowX = value;
        return that;
    });

    util.addMethod(that, "overflowY", function (value) {
        that.style.overflowY = value;
        return that;
    });

    util.addMethod(that, "abs", function () {
        return that.pos("absolute");
    });

    util.addMethod(that, "rel", function () {
        return that.pos("relative");
    });

    util.addMethod(that, "pos", function (pos) {
        that.style.position = pos;
        return that;
    });

    util.addMethod(that, "left", function (value) {
        return gui.stylePxIfInt(that, "left", value);
    });

    util.addMethod(that, "getLeft", function () {
        return that.offsetLeft || gui.getStyleInt(that, "left");
    });

    util.addMethod(that, "x", function (value) {
        return that.left(value);
    });

    util.addMethod(that, "getX", function () {
        return that.getLeft();
    });

    util.addMethod(that, "right", function (value) {
        return gui.stylePxIfInt(that, "right", value);
    });

    util.addMethod(that, "getRight", function () {
        return gui.getStyleInt(that, "right") || that.getX() + that.getW();
    });

    util.addMethod(that, "top", function (value) {
        return gui.stylePxIfInt(that, "top", value);
    });

    util.addMethod(that, "getTop", function () {
        return that.offsetTop || gui.getStyleInt(that, "top");
    });

    util.addMethod(that, "y", function (value) {
        return that.top(value);
    });

    util.addMethod(that, "getY", function () {
        return that.getTop();
    });

    util.addMethod(that, "bottom", function (value) {
        return gui.stylePxIfInt(that, "bottom", value);
    });

    util.addMethod(that, "getBottom", function () {
        return gui.getStyleInt(that, "bottom") || that.getY() + that.getH();
    });

    util.addMethod(that, "w", function (value) {
        return gui.stylePxIfInt(that, "width", value);
    });

    util.addMethod(that, "getW", function () {
        return that.offsetWidth || that.getOffsetW();
    });

    util.addMethod(that, "getOffsetW", function () {
        return gui.getStyleInt(that, "width")
            + gui.getStyleInt(that, "paddingLeft") + gui.getStyleInt(that, "paddingRight")
            + gui.getStyleInt(that, "borderLeft") + gui.getStyleInt(that, "borderRight");
    });

    util.addMethod(that, "h", function (value) {
        return gui.stylePxIfInt(that, "height", value);
    });

    util.addMethod(that, "getH", function () {
        return that.offsetHeight || that.getOffsetH();
    });

    util.addMethod(that, "getOffsetH", function () {
        return gui.getStyleInt(that, "height")
            + gui.getStyleInt(that, "paddingTop") + gui.getStyleInt(that, "paddingBottom")
            + gui.getStyleInt(that, "borderTop") + gui.getStyleInt(that, "borderBottom");
    });

    util.addMethod(that, "minWidth", function (value) {
        return gui.stylePxIfInt(that, "minWidth", value);
    });

    util.addMethod(that, "minHeight", function (value) {
        return gui.stylePxIfInt(that, "minHeight", value);
    });

    util.addMethod(that, "setClass", function (className) {
        that.className = className;
        return that;
    });

    util.addMethod(that, "bg", function (value) {
        that.style.background = value;
        return that;
    });

    util.addMethod(that, "border", function (value) {
        that.style.border = value;
        return that;
    });

    util.addMethod(that, "borderColor", function (value) {
        that.style.borderColor = value;
        return that;
    });

    util.addMethod(that, "radius", function (value) {
        that.style.borderRadius = value + "px";
        return that;
    });

    util.addMethod(that, "color", function (value) {
        that.style.color = value;
        return that;
    });

    util.addMethod(that, "setSize", function (w, h) {
        gui.stylePxIfInt(that, "width", w);
        gui.stylePxIfInt(that, "height", h);
        return that;
    });

    util.addMethod(that, "fontSize", function (value) {
        return gui.stylePxIfInt(that, "fontSize", value);
    });

    util.addMethod(that, "fontFamily", function (value) {
        that.style.fontFamily = value;
        return that;
    });

    util.addMethod(that, "opacity", function (value) {
        that.style.opacity = value;
        return that;
    });

    util.addMethod(that, "float", function (value) {
        that.style.float = value;
        return that;
    });

    util.addMethod(that, "textAlign", function (value) {
        that.style.textAlign = value;
        return that;
    });

    util.addMethod(that, "cursor", function (value) {
        that.style.cursor = value;
        return that;
    });

    that.typeIs = "gStyle";
    that.typeClass = "gStyle";

    return that;
}
