/*global SMix*/
/*global SDebug*/
/*global makeGIO*/
/*global gContainerInit*/
/*global gContainerAddContent*/
/*global gMakeLabel*/
/*global gMakeSlider*/

function SCOut(container) {
    gContainerInit(this, container, "Out");
    
    var mix = /*new SMix()*/ new SDebug(),
        ioport = makeGIO(mix, false, "mix");

    this.mix = mix;
    gContainerAddContent(this, ioport);
}