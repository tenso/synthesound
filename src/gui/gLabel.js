"use strict";
/*global gBase*/

function gLabel(label) {
    var guiLabel = gBase();
    guiLabel.innerText = label;
    guiLabel.className = "component-label";
    
    guiLabel.alignLeft = function () {
        guiLabel.style.textAlign = "left";
        return guiLabel;
    };
    
    return guiLabel;
}