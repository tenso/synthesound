"use strict";

/*global sMix*/
/*global sDebug*/
/*global gIO*/
/*global gui*/

function SCOut(container) {
    gui.containerInit(this, container, "Output");
    
    var mix = sMix(),
        ioport = gIO.make(mix, false, ""),
        setGain = function (value) {
            mix.setChannelGain(0, value);
            mix.setChannelGain(1, value);
        }

    this.mix = mix;
    gui.containerAddContent(this, ioport);
    gui.containerAddLabeledContent(this, gui.makeSlider(0.5, 0.0, 1.0, setGain), "VOL");
}