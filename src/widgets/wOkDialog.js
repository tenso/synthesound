/*jslint node: true */

/*global wModalDialog*/
/*global gInput*/
/*global gButton*/
/*global lang*/
/*global log*/
/*global gLabel*/
/*global gBase*/

"use strict";

function wOkDialog(cb, name, parent) {
    var that = wModalDialog(name, parent),
        ok;

    ok = gButton(lang.tr("ok"), function () {
        if (typeof cb === "function") {
            cb();
        }
        that.remove();
    }).abs().right(10).bottom(10);

    that.add(ok);

    return that;
}
