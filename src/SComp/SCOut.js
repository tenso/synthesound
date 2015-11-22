/*global SMix*/
/*global makeGIO*/
/*global gContainerInit*/
/*global gContainerAddContent*/
/*global gMakeLabel*/
/*global gMakeSlider*/

function SCOut(container) {
    gContainerInit(this, container, "Out");
    
    var mix = new SMix(),
        ioport = makeGIO(mix, false);
    this.mix = mix;
    ioport.id = "SCOut-in";
    gContainerAddContent(this, ioport);
}