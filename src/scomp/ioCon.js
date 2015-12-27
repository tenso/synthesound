"use strict";

function ioCon(toPort, fromPort) {
    var that = {};
    
    that.to = function () {
        return toPort;
    };
    
    that.from = function () {
        return fromPort;
    };
    
    that.data = function () {
        return {
            to: toPort.data(),
            from: fromPort.data()
        };
    };
    
    return that;
}