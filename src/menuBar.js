"use strict";
/*global gWidget*/
/*global gButton*/
/*global wMenuButton*/
/*global wMenu*/
/*global gLabel*/
/*global wNote*/
/*global app*/
/*global Files*/

function menuBar(container, contentContainer) {
    var that = gWidget(container).canMove(false).z(10000).border("0").radius(0).w("100%").padding(2),
        file,
        about,
        log,
        menus = [],
        helpString = "Help me!",
        aboutString = "SyntheSound v." + app.ver + "\n(C) 2015 Anton Olofsson, GPL 3",
        loadInput;
    
    that.addContent(gButton("panic", function () {
        contentContainer.stopAudio();
    }).bg("#f00"));
    
    loadInput = Files.createLoadDataInput(function (data) {
        contentContainer.loadWorkspace(data);
    });
    
    file = wMenuButton("file", menus);
    file.addOverlayed("load", loadInput);
    
    file.add("save", function () {
        var data = contentContainer.data();
        Files.saveData("synthdata.json", data);
    });
    that.addContent(file);
    
    about = wMenuButton("?", menus);
    about.add("help", function () {wNote(contentContainer, helpString).padding(40); });
    about.add("about", function () {wNote(contentContainer, aboutString).padding(40); });
    that.addContent(about);
    
    log = wMenuButton("detected errors", menus).show(false);
    that.addContent(log);
    
    that.addEventListener("mouseleave", function () {
        file.closeAll();
    });
    
    that.logError = function (error) {
        log.bg("#f00").show(true);
        log.add("error #" + log.menu.contentCount(), function () {
            wNote(contentContainer, error).padding(40).bg("#f00").color("#000");
        });
        wNote(contentContainer, error).padding(40).bg("#f00").color("#000");
    };
    
    return that;
}