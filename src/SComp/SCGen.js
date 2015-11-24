/*global SGen*/
/*global makeGIO*/
/*global GUI*/

function SCGen(container) {
    GUI.containerInit(this, container, "GEN");
    
    this.typeButtons = [];
    
    var out = new SGen({"freq": 110, "amp": 0.25, "type": "sine"}),
        ioport = makeGIO(out, true, ""),
        freqport = makeGIO(out, false, "freq"),
        button;

    GUI.containerAddLabeledContent(this, ioport, "out");
    GUI.containerAddLabeledContent(this, freqport, "Hz");
    
    button = GUI.makeButton("sine", function () {out.type = "sine"; }, true, this.typeButtons);
    button.setValue(true);
    GUI.containerAddContent(this, button);
    
    button = GUI.makeButton("square", function () {out.type = "square"; }, true, this.typeButtons);
    GUI.containerAddContent(this, button);
}