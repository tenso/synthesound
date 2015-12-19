"use strict";
/*global gui*/
/*global sCBase*/
/*global gScope*/
/*global sMix*/

function sCScope(container, args, uid) {
    var that,
        mix = sMix(),
        scopes = [];
    
    that = sCBase(container, "sCScope", {mix: mix}, args, uid);
    that.addIn("mix").addOut("mix");
    mix.setChanUpdatedCallback(function (chan, data) {scopes[chan].drawGraph(data); });
    scopes[0] = gScope(0).drawGraph();
    scopes[1] = gScope(1).drawGraph();
        
    that.nextRow().addContent(scopes[0], true).nextRow().addContent(scopes[1], true);
        
    return that;
}