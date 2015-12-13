"use strict";
/*global gWidget*/
/*global inPort*/
/*global outPort*/
/*global gIO*/
/*global log*/

//FIXME: rename all sC to sG

function sCBase(context, soundComp, sCompArgs, permanent) {
    var that = gWidget(context, soundComp.title()),
        ports = [];
        
    soundComp.setArgs(sCompArgs);
        
    if (!permanent) {
        that.addRemove(function () {
            gIO.delAllConnectionsToAndFromSComp(soundComp);
        });
    }
    
    that.addIn = function (type) {
        var port = inPort(soundComp, type);
        that.addLabeledContent(port, type || "in");
        ports.push(port);
        return that;
    };
    
    that.addOut = function () {
        var port = outPort(soundComp);
        that.addLabeledContent(port, "out");
        ports.push(port);
        return that;
    };
    
    that.sCData = function () {
        var data = {
                sId: soundComp.title(),
                uid: soundComp.uid(),
                sArgs: soundComp.getArgs(),
                x: that.getX(),
                y: that.getY(),
                inputs: soundComp.getInputsUID()
            };
            
        return data;
    };
    
    that.setSCompUID = function (uid) {
        soundComp.setUid(uid);
        return that;
    };
    
    that.uid = function () {
        return soundComp.uid();
    };
    
    that.sComp = function () {
        return soundComp;
    };
    
    that.getPort = function (isOut, type) {
        var i;
        for (i = 0; i < ports.length; i += 1) {
            if (ports[i].isOut === isOut && ports[i].ioType === type) {
                return ports[i];
            }
        }
        log.error("could not find port " + soundComp.title() + " " + soundComp.uid() + " " + type + " out:" + isOut);
        return undefined;
    };
    
    return that;
}