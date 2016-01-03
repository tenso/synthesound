"use strict";

function uidGen() {
    var that = {},
        UIDcount = 0;

    that.getUID = function () {
        var uid = UIDcount;
        UIDcount += 1;
        return uid;
    };

    that.peek = function () {
        return UIDcount;
    };

    that.bumpTo = function (offset) {
        UIDcount = offset;
        return that;
    };

    return that;
}
