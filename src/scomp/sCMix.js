"use strict";
/*global gui*/
/*global sMix*/
/*global sCBase*/

function sCMix(container, args) {
    var that,
        mix = sMix();
    
    that = sCBase(container, "sCMix", {mix: mix}, args).addIn("mix").addOut("mix");
                    
    return that;
}