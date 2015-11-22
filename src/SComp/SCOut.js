/*global SMix*/
/*global initGIO*/
/*global gContainerInit*/
/*global gContainerAddContent*/
/*global gMakeLabel*/
/*global gMakeSlider*/

function SCOut(container) {
    gContainerInit(this, container, "Out");
    
    this.out = new SMix();
        
    var ioport = makeGIO(this.out, false);
    ioport.id = "SCOut-in";
    gContainerAddContent(this, ioport);
}