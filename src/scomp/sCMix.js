"use strict";
/*global gui*/
/*global sMix*/
/*global sCBase*/

function sCMix(container, args, uid) {
    var mix = sMix(),
        that = sCBase(container, "sCMix", {mix: mix}, args, uid);
    
    that.addIn("mix").addOut("mix");
                    
    return that;
}