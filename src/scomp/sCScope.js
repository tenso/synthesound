"use strict";
/*global gui*/
/*global sCBase*/
/*global gScope*/
/*global sMix*/

function sCScope(container, uid) {
    var mix = sMix(),
        that = sCBase(container, "sCScope", {mix: mix}, uid),
        scopes = [];

    that.addIn("mix").addOut("mix");
    mix.setChanUpdatedCallback(function (chan, data) {scopes[chan].drawGraph(data); });
    scopes[0] = gScope().drawGraph();
    scopes[1] = gScope().drawGraph();

    that.nextRow().addTabled(scopes[0], true).nextRow().addTabled(scopes[1], true);

    return that;
}
