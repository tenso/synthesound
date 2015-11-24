/*global SMix*/
/*global SDebug*/
/*global makeGIO*/
/*global GUI*/

function SCOut(container) {
    GUI.containerInit(this, container, "Output");
    
    var mix = new SMix(), /* new SDebug(),*/
        ioport = makeGIO(mix, false, "");

    this.mix = mix;
    GUI.containerAddContent(this, ioport);
}