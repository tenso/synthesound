/*jslint node: true */

/*global log*/

"use strict";

Function.prototype.method = function (name, func) {
    if (this.prototype[name]) {
        log.error("already have:" + name);
    } else {
        this.prototype[name] = func;
    }
};
