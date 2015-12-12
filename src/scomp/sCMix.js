"use strict";
/*global gui*/
/*global sMix*/
/*global sCBase*/

function sCMix(container, args) {
    var that,
        mix = sMix();
    
    that = sCBase(container, mix, args).addIn().addOut();
                    
    return that;
}