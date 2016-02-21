/*jslint node: true */

/*global wDialog*/
/*global gInput*/
/*global gButton*/
/*global lang*/
/*global log*/
/*global gLabel*/
/*global gBase*/

"use strict";

function wOkDialog(name, parent, cb) {
    var that = wDialog(name, parent),
        ok;

    ok = gButton(lang.tr("ok"), function () {
        that.emit("ok", that);
        if (typeof cb === "function") {
            cb(that);
        }
    }).abs().right(10).bottom(10);

    that.add(ok);

    return that;
}
