"use strict";
/*global input*/
/*global log*/
/*global MouseEvent*/

var gui = {
    nextZValue: 1,
    
    nextZ: function () {
        var ret = gui.nextZValue;
        gui.nextZValue += 1;
        return ret;
    },

    getPos: function (element) {
        var x = element.offsetLeft,
            y = element.offsetTop;

        while (element.offsetParent) {
            element = element.offsetParent;
            x += element.offsetLeft;
            y += element.offsetTop;
        }

        return {x: x, y: y};
    },
    
    getEventOffsetInElement: function (element, event) {
        var pos = gui.getPos(element);
        return {
            x: event.pageX - pos.x,
            y: event.pageY - pos.y
        };
    },
    
    getSize: function (elem) {
        var w = elem.offsetWidth,
            h = elem.offsetHeight;

        return {w: w, h: h};
    },

    getStyle: function (element, property) {
        if (element.style[property]) {
            return element.style[property];
        }
        return window.getComputedStyle(element, undefined).getPropertyValue(property);
    },

    getStyleInt: function (element, property) {
        return parseInt(gui.getStyle(element, property), 10);
    },
    
    stylePxIfInt: function (obj, param, value) {
        if (typeof value === "integer") {
            obj.style[param] = value + "px";
        } else {
            obj.style[param] = value;
        }
        return obj;
    },
    
    clickObj: function (obj) {
        var clickEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: false
        });
        obj.dispatchEvent(clickEvent);
    }
};