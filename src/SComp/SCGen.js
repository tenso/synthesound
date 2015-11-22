/*global SGen*/
/*global makeGIO*/
/*global gContainerInit*/
/*global gContainerAddContent*/
/*global gMakeLabel*/
/*global gMakeSlider*/
/*global gMakeButton*/

function SCGen(container) {
    gContainerInit(this, container, "GEN");
    
    this.typeButtons = [];
    
    var out = new SGen({"freq": 110, "amp": 0.25, "type": "sine"}),
        ioport = makeGIO(out, true, ""),
        freqport = makeGIO(out, false, "freq"),
        button;

    gContainerAddLabeledContent(this, ioport, "out");
    gContainerAddLabeledContent(this, freqport, "Hz");
    
    button = gMakeButton("sine", function () {out.type = "sine"; }, true, this.typeButtons);
    button.setValue(true);
    gContainerAddContent(this, button);
    
    button = gMakeButton("square", function () {out.type = "square"; }, true, this.typeButtons);
    gContainerAddContent(this, button);
}