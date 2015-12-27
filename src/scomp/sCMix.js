"use strict";
/*global gui*/
/*global sMix*/
/*global sCBase*/

function sCMix(container, uid) {
    var mix = sMix(),
        that = sCBase(container, "sCMix", {mix: mix}, uid);
    
    that.addIn("mix").addOut("mix");
                    
    return that;
}