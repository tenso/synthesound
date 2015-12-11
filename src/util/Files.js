"use strict";
/*global URL*/
/*global Blob*/

var Files = {

    saveData: function (fileName, data) {
        var stringData = JSON.stringify(data),
            a = document.createElement("a"),
            blob = new Blob([stringData], {type: "application/json"});
        
        if (Files.saveUrl) {
            URL.revokeObjectURL(Files.saveUrl);
            Files.saveUrl = undefined;
        }
        Files.saveUrl = URL.createObjectURL(blob);
        
        a.href = Files.saveUrl;
        a.download = fileName;
        a.textContent = "download file: " + fileName;
        a.click();
    },
    
    loadData: function (dataCallback) {
        var load = document.createElement("input");
        
        load.type = "file";
        load.onchange = function () {
            var file = load.files[0],
                fileReader = new FileReader();
            
            fileReader.readAsText(file);
            fileReader.onload = function () {
                dataCallback(JSON.parse(fileReader.result));
            };
        };
        load.click();
    }
};