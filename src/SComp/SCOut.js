"use strict";

/*global sMix*/
/*global sDebug*/
/*global makeGIO*/
/*global GUI*/

function SCOut(container) {
    GUI.containerInit(this, container, "Output");
    
    var mix = sMix(), /* sDebug(),*/
        ioport = makeGIO(mix, false, "");

    this.mix = mix;
    GUI.containerAddContent(this, ioport);
}