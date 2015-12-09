"use strict";
/*global gui*/

function gBase() {
    var that = document.createElement("div"),
        originalColor,
        hoverColor;
    
    that.move = function (x, y) {
        that.style.left = x + "px";
        that.style.top = y + "px";
        return that;
    };
    
    that.z = function (value) {
        that.style.zIndex = value;
        return that;
    };
    
    that.abs = function () {
        return that.pos("absolute");
    };
    
    that.pos = function (pos) {
        that.style.position = pos;
        return that;
    };
    
    that.left = function (x) {
        that.style.left = x + "px";
        return that;
    };
        
    that.right = function (x) {
        that.style.right = x + "px";
        return that;
    };
    
    that.top = function (y) {
        that.style.top = y + "px";
        return that;
    };
    
    that.bottom = function (y) {
        that.style.bottom = y + "px";
        return that;
    };
          
    that.width = function (value) {
        return gui.stylePxIfInt(that, "width", value);
    };
    
    that.height = function (value) {
        return gui.stylePxIfInt(that, "height", value);
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
    
    that.size = function (w, h) {
        that.style.width = w + "px";
        that.style.height = h + "px";
        that.style.lineHeight = h + "px";
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
    
    return that;
}