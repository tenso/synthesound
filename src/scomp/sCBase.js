"use strict";
/*global gWidget*/
/*global gIO*/

function sCBase(context, sComp, sCompArgs, permanent) {
    var that = gWidget(context, sComp.title());
        
    sComp.setArgs(sCompArgs);
        
    if (!permanent) {
        that.addRemove(function () {
            gIO.delAllConnectionsToAndFromSComp(sComp);
        });
    }
    
    that.sCData = function () {
        var data = {
                "sId": sComp.title(),
                "uid": sComp.uid(),
                "sArgs": sComp.getArgs(),
                "x": that.getX(),
                "y": that.getY(),
                "inputs": sComp.getInputsUID()
            };
            
        return data;
    };
    return that;
}