/*jslint node: true */

/*global sMix*/
/*global sCBase*/

"use strict";

function sCMix(container, uid) {
    var mix = sMix(),
        that = sCBase(container, "sCMix", mix, uid);

    that.addIn().addOut();

    return that;
}
