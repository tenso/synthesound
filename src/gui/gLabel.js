"use strict";

function gLabel(label) {
    var guiLabel = document.createElement("div");
    guiLabel.innerText = label;
    guiLabel.className = "component-label";
    
    guiLabel.alignLeft = function () {
        guiLabel.style.textAlign = "left";
        return guiLabel;
    };
    
    return guiLabel;
}