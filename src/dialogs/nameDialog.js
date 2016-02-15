/*global gWidget*/
/*global gInput*/
/*global gButton*/
/*global lang*/
/*global log*/
/*global net*/
/*global user*/
/*global gLabel*/
"use strict";

function nameDialog(cb) {
    var that = gWidget().setTitle(lang.tr("name")).addRemove().w(360).h(100),
        name = gInput("", undefined, lang.tr("name")).abs().x(10).y(30).w(340),
        status = gLabel("").abs().left(10).bottom(10),
        ok;

    ok = gButton(lang.tr("ok"), function () {
        if (typeof cb === "function") {
            cb(name.getValue());
        }
    }).abs().right(10).bottom(10);

    that.add(name).add(ok);
    that.add(status);

    return that;
}
