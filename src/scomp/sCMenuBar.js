"use strict";
/*global gWidget*/
/*global gButton*/
/*global gMenuButton*/
/*global gMenu*/
/*global gLabel*/
/*global audio*/
/*global gNote*/
/*global app*/

function sCMenuBar(container, contentContainer) {
    var that = gWidget(container).canMove(false).z(10000).border("0").radius(0).width("100%").padding(2),
        file,
        about,
        log,
        menus = [],
        helpString = "Help me!",
        aboutString = "SyntheSound v." + app.ver + "\n(C) 2015 Anton Olofsson, GPL 3";
    
    that.addContent(gButton("panic", function () {
        audio.stopAudio();
    }).bg("#f00"));
    
    file = gMenuButton("file", menus);
    file.add("load", function () {gNote(contentContainer, "load").padding(40); });
    file.add("save", function () {gNote(contentContainer, "save").padding(40); });
    that.addContent(file);
    
    about = gMenuButton("?", menus);
    about.add("help", function () {gNote(contentContainer, helpString).padding(40); });
    about.add("about", function () {gNote(contentContainer, aboutString).padding(40); });
    that.addContent(about);
    
    log = gMenuButton("detected errors", menus).show(false);
    that.addContent(log);
    
    that.addEventListener("mouseleave", function () {
        file.closeAll();
    });
    
    that.logError = function (error) {
        log.bg("#f00").show(true);
        log.add("error #" + log.menu.contentCount(), function () {
            gNote(contentContainer, error).padding(40).bg("#f00").color("#000");
        });
        gNote(contentContainer, error).padding(40).bg("#f00").color("#000");
    };
    
    return that;
}