'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
var mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({width: 1920, height: 1080, icon: "synth.ico"});
    mainWindow.setMenu(null);
    mainWindow.loadURL('file://' + __dirname + '/src/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
