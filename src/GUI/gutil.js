"use strict";

function getStyle(element, property) {
    return window.getComputedStyle(element, null).getPropertyValue(property);
}

function getStyleInt(element, property) {
    return parseInt(getStyle(element, property), 10);
}
