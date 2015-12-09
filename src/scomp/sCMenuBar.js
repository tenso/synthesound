"use strict";
/*global gWidget*/
/*global gButton*/
/*global gMenuButton*/
/*global gMenu*/
/*global audio*/

function sCMenuBar(container) {
    var that = gWidget(container).canMove(false).z(10000).border("0").radius(0).width("100%").padding(2),
        file,
        about,
        menus = [];
    
    that.addContent(gButton("panic", function () {
        audio.stopAudio();
    }).bg("#f00"));
    
    file = gMenuButton("file", menus);
    file.add("load", function () {console.log("load"); });
    file.add("save", function () {console.log("save"); });
    that.addContent(file);
    
    about = gMenuButton("?", menus);
    about.add("help", function () {console.log("?"); });
    about.add("about", function () {console.log("about"); });
    that.addContent(about);
    
    that.addEventListener("mouseleave", function () {
        file.closeAll();
    });
        
    return that;
}