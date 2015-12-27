"use strict";
/*global URL*/
/*global Blob*/
/*global FileReader*/
/*global gui*/
/*global gBase*/

var files = {
    saveUrl: undefined,
    
    saveData: function (fileName, data) {
        var stringData = JSON.stringify(data, undefined, 2),
            link = document.createElement("a"),
            blob = new Blob([stringData], {type: "application/json"});
        
        if (files.saveUrl) {
            URL.revokeObjectURL(files.saveUrl);
            files.saveUrl = undefined;
        }
        files.saveUrl = URL.createObjectURL(blob);
        
        link.href = files.saveUrl;
        link.download = fileName;
        link.textContent = "download file: " + fileName;
        gui.clickObj(link);
    },
    
    
    loadData: function (dataCallback) {
        var input = gBase("input");
        
        input.type = "file";
        input.onchange = function () {
            var file = input.files[0],
                fileReader = new FileReader();
            
            fileReader.readAsText(file);
            fileReader.onload = function () {
                dataCallback(JSON.parse(fileReader.result));
            };
        };
        gui.clickObj(input);
    },
    
    createLoadDataInput: function (dataCallback) {
        var input = gBase("input");
        input.abs().x(0).y(0).w("100%").opacity(0);
        input.type = "file";
        input.onchange = function () {
            var file = input.files[0],
                fileReader = new FileReader();
            
            fileReader.readAsText(file);
            fileReader.onload = function () {
                dataCallback(JSON.parse(fileReader.result));
            };
        };
        return input;
    }
};