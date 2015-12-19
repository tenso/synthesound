"use strict";

function uidGen() {
    var that = {},
        UIDcount = 0;
    
    that.getUID = function () {
        var uid = UIDcount;
        UIDcount += 1;
        return uid;
    };
    
    that.peekUID = function () {
        return UIDcount;
    };
            
    return that;
}