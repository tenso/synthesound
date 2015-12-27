"use strict";
/*global gWidget*/
/*global inPort*/
/*global outPort*/
/*global gIO*/
/*global log*/
/*global uidGen*/

//FIXME: rename all sC to sG
//FIXME: rename all sId to portName?

var scBaseUID = uidGen();

function sCBase(context, type, sComps, sArgs, uid) {
    var that = gWidget(context, type),
        ports = {},
        myUID;

    function makeRemoveAllConnections() {
        return function () {
            gIO.delAllConnectionsToAndFromUID(that.uid());
        };
    }
    
    //FIXME: mixin uid functions?
    that.uid = function () {
        return myUID;
    };
        
    that.setArgs = function (sArgs) {
        var sId;
        for (sId in sComps) {
            if (sComps.hasOwnProperty(sId)) {
                if (sArgs && sArgs.hasOwnProperty(sId)) {
                    sComps[sId].setArgs(sArgs[sId]);
                }
            }
        }
    };
        
    that.clearPorts = function () {
        var sId;
        for (sId in sComps) {
            if (sComps.hasOwnProperty(sId)) {
                ports[sId] = [];
            }
        }
    };
        
    that.addIn = function (sId, type) {
        if (!sComps.hasOwnProperty(sId)) {
            log.error("sCBase.addIn: dont have:" + sId);
            return;
        }
        
        var port = inPort(that.uid(), sComps[sId], sId, type);
        that.addLabeledContent(port, type || "in");
        ports[sId].push(port);
        return that;
    };
    
    that.addOut = function (sId, type) {
        if (!sComps.hasOwnProperty(sId)) {
            log.error("sCBase.addOut dont have:" + sId);
            return;
        }
        
        var port = outPort(that.uid(), sComps[sId], sId, type);
        that.addLabeledContent(port, type || sId || "out");
        ports[sId].push(port);
        return that;
    };
    
    that.data = function () {
        var sId,
            i,
            data = {
                type: type,
                uid: that.uid(),
                x: that.getX(),
                y: that.getY(),
                sComps: [],
                sArgs: {}
            };

        for (sId in sComps) {
            if (sComps.hasOwnProperty(sId)) {
                data.sComps.push({
                    type: sComps[sId].typeId(),
                    sId: sId
                });
            }
        }
        
        for (sId in sComps) {
            if (sComps.hasOwnProperty(sId)) {
                data.sArgs[sId] = sComps[sId].getArgs();
            }
        }
        
        return data;
    };
    
    that.getPort = function (sId, isOut, type) {
        var i;
        
        if (!sComps.hasOwnProperty(sId)) {
            log.error(that.uid() + ".getPort: dont have:" + sId);
            log.obj(sComps);
            return;
        }
        
        for (i = 0; i < ports[sId].length; i += 1) {
            if (ports[sId][i].isOut === isOut && ports[sId][i].portType === type) {
                return ports[sId][i];
            }
        }
        log.error("could not find port");
        return undefined;
    };
    
    if (typeof uid === "number") {
        myUID = uid;
    } else {
        myUID = scBaseUID.getUID();
    }
    
    that.addRemove(makeRemoveAllConnections());
    that.setArgs(sArgs);
    that.clearPorts();
    
    return that;
}