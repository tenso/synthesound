/*global gWidget*/
/*global gInput*/
/*global gButton*/
/*global lang*/
/*global log*/
/*global gLabel*/
"use strict";

function okDialog(cb, title, parent) {
    var that = gWidget().setTitle(title).addRemove().w(360).h(60),
        ok;

    ok = gButton(lang.tr("ok"), function () {
        if (typeof cb === "function") {
            cb();
        }
        that.remove();
    }).abs().right(10).bottom(10);

    that.add(ok);

    if (parent) {
        if (parent.theDialog) {
            parent.theDialog.remove();
        }
        parent.theDialog = that;
        parent.add(that);
    }

    return that.canMove(false);
}
