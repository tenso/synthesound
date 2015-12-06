"use strict";

function gLabel(label) {
    var guiLabel = document.createElement("div");
    guiLabel.innerText = label;
    guiLabel.className = "component-label";
    
    return guiLabel;
}