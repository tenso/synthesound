"use strict";
/*global input*/
/*global log*/

var gui = {
    getPos: function (element) {
        var x = element.offsetLeft,
            y = element.offsetTop;

        while (element.offsetParent) {
            element = element.offsetParent;
            x += element.offsetLeft;
            y += element.offsetTop;
        }

        return {"x": x, "y": y};
    },
    
    getEventOffsetInElement: function (element, event) {
        var pos = gui.getPos(element);
        return {"x": event.clientX - pos.x, "y": event.clientY - pos.y};
    },
    
    getSize: function (elem) {
        var w = elem.offsetWidth,
            h = elem.offsetHeight;

        return {"w": w, "h": h};
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
};