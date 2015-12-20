"use strict";
/*global log*/
/*global input*/
/*global gui*/
/*global gBase*/
/*global gLabel*/
/*global gButton*/
/*global gIO*/
/*global app*/

/*FIXME: should be called gContainer maybe?*/

function gWidget(container, titleLabel) {
    var that = gBase();
    
    that.nextRow = function () {
        that.content = gBase("tr").setClass("gWidgetRow");
        that.table.appendChild(that.content);
        return that;
    };
    
    that.contentCount = function () {
        return that.content.childNodes.length;
    };
    
    that.remove = function () {
        that.container.removeChild(that);
    };
    
    function makeTitle(titleLabel) {
        var titleElem = gBase().marginRight(20);//that is close buttons width
        
        titleElem.innerText = titleLabel;
        return titleElem;
    }

    function containerInit(container, titleLabel) {
        if (!that) {
            log.error("gui.containerInit: that is undefined");
        } else if (!container) {
            log.error("gui.containerInit: container is undefined");
        }
        that.container = container;
        that.className = "gWidget";
        that.style.position = "absolute";
        that.style.zIndex = gui.nextZ();
        
        that.titleRow = gBase();
        that.titleRow.setClass("gWidgetTitle");
        that.appendChild(that.titleRow);
        
        that.contId = container.id;
        //that.table = gBase("table"); //FIXME: gives borders!!
        that.table = document.createElement("table");
        that.table.className = "gWidgetTable";
                        
        if (typeof titleLabel === "string") {
            that.titleLabel = titleLabel;
            that.titleRow.appendChild(makeTitle(that.titleLabel));
        }
        
        that.appendChild(that.table);
        container.appendChild(that);

        that.nextRow();
    }

    containerInit(container, titleLabel);

    that.addContent = function (content, wholeRow) {
        var cont = gBase("td").setClass("gWidgetCell");
        cont.appendChild(content);
        that.content.appendChild(cont);
        if (wholeRow) {
            cont.colSpan = 1000;
        }
        return that;
    };
    
    that.addLabeledContent = function (content, label) {
        var cont = gBase().display("inline-block"),
            contLabel = gLabel(label);
        
        //if we know its gBase: content.margin("0 auto");
        content.style.margin = "auto";
        
        cont.appendChild(contLabel);
        cont.appendChild(content);
        that.addContent(cont);
        return that;
    };
    
    that.addRemove = function (callback) {
        var button = gButton("x", function () {
            if (callback) {
                callback();
            }
            that.remove();
        }).abs().setClass("button gWidgetCloseButton");
        
        
        that.titleRow.appendChild(button);
        return that;
    };

    that.canMove = function (value) {
        if (value) {
            that.onmousedown = function (e) {
                input.setMouseCapturer(e, that);
            };
            
            that.iMouseCaptured = function () {
                that.style.zIndex = gui.nextZ();  
            };
            
            that.iMousePressAndMove = function (e, mouse) {
                that.move(mouse.relativeX, mouse.relativeY);
                if (that.getX() < app.screen.minX) {
                    that.x(app.screen.minX);
                }
                if (that.getY() < app.screen.minY) {
                    that.y(app.screen.minY);
                }
                //FIXME: this is uncessesary coupling
                gIO.drawConnections();
            };
        } else {
            that.onmousedown = undefined;
            that.iMousePressAndMove = undefined;
        }
        return that;
    };
    
    that.padding = function (value) {
        that.table.style.padding = value;
        return that;
    };
    
    that.canMove(true).move(0, 0);
    return that;
}