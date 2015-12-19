"use strict";
/*global gui*/
/*global sMix*/
/*global sCBase*/

function sCMix(container, args, uid) {
    var that,
        mix = sMix();
    
    that = sCBase(container, "sCMix", {mix: mix}, args, uid).addIn("mix").addOut("mix");
                    
    return that;
}