"use strict";
/*global gWidget*/
/*global gIO*/

function sCBase(context, sComp, sCompArgs, inPorts, outPorts, permanent) {
    var that = gWidget(context, sComp.title());
        
    sComp.setArgs(sCompArgs);
        
    if (!permanent) {
        that.addRemove(function () {
            gIO.delAllConnectionsToAndFromSComp(sComp);
        });
    }
    
    that.data = function () {
        return {
            "sId": sComp.title(),
            "sArgs": sComp.getArgs(),
            "x": that.getX(),
            "y": that.getY()
        };
    };
    return that;
}