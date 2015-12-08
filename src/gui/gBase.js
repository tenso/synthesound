"use strict";
/*global gui*/

function gBase() {
    var that = document.createElement("div");
    
    that.move = function (x, y) {
        that.style.left = x + "px";
        that.style.top = y + "px";
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
    
    return that;
}