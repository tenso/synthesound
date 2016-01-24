"use strict";
/*global log*/

Function.prototype.method = function (name, func) {
    if (this.prototype[name]) {
        log.error("already have:" + name);
    } else {
        this.prototype[name] = func;
    }
};
