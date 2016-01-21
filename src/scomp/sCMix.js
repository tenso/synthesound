"use strict";
/*global sMix*/
/*global sCBase*/

function sCMix(container, uid) {
    var mix = sMix(),
        that = sCBase(container, "sCMix", mix, uid);

    that.addIn().addOut();

    return that;
}
