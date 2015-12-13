"use strict";

function uidGen() {
    var that = {},
        UIDcount = 0;
    
    that.getUID = function () {
        var uid = UIDcount;
        UIDcount += 1;
        return uid;
    };
    return that;
}