"use strict";
/*global gui*/

function gBase(type) {
    var that = document.createElement(type || "div"),
        originalColor,
        hoverColor,
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
        that.style.padding = value;
        return that;
    };
    
    that.paddingLeft = function (value) {
        that.style.paddingLeft = value;
        return that;
    };
    
    that.paddingRight = function (value) {
        that.style.paddingRight = value;
        return that;
    };
    
    that.margin = function (value) {
        that.style.margin = value;
        return that;
    };
        
    that.marginLeft = function (value) {
        return gui.stylePxIfInt(that, "marginLeft", value);
    };
    
    that.marginRight = function (value) {
        return gui.stylePxIfInt(that, "marginRight", value);
    };
    
    //normal, nowrap, ...
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
    
    that.x = function (value) {
        return that.left(value);
    };
    
    that.right = function (value) {
        return gui.stylePxIfInt(that, "right", value);
    };
    
    that.top = function (value) {
        return gui.stylePxIfInt(that, "top", value);
    };
    
    that.y = function (value) {
        return that.top(value);
    };
    
    that.bottom = function (value) {
        return gui.stylePxIfInt(that, "bottom", value);
    };
          
    that.w = function (value) {
        return gui.stylePxIfInt(that, "width", value);
    };
    
    that.h = function (value) {
        return gui.stylePxIfInt(that, "height", value);
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
    
    that.getX = function () {
        return that.offsetLeft;
    };
    
    that.getY = function () {
        return that.offsetTop;
    };
    
    that.getW = function () {
        return that.offsetWidth;
    };
    
    that.getH = function () {
        return that.offsetHeight;
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
    
    that.float = function (value) {
        that.style.float = value;
        return that;
    };
    
    that.addAt = function (element, x, y) {
        element.abs().move(x, y);
        that.appendChild(element);
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