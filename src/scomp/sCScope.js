"use strict";
/*global gui*/
/*global gWidget*/
/*global gScope*/

function sCScope(container) {
    var that = gWidget(container, "scope (fixme)"),
        scopes = [];
    
    scopes[0] = gScope(0);
    scopes[1] = gScope(1);
    
    that.addContent(scopes[0]).nextRow().addContent(scopes[1]);
    
    that.drawScope = function (chan, data) {
        scopes[chan].drawGraph(data);
    };
    
    return that;
}