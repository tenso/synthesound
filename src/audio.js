"use strict";
/*global log*/
/*global test*/
/*global sOutNode*/
/*global sMix*/
/*global sCScope*/
/*global sCOut*/
/*global sCGen*/
/*global sCVKey*/
/*global sCAdsr*/
/*global sCDelay*/
/*global sCMix*/
/*global gui*/
/*global gMenu*/
/*global app*/

var audio = {
    generators: [],
    mixer: undefined,
    mixerOut: undefined,
    adsr: undefined,
    delay: undefined,
    out: undefined,
    key: undefined,
    scope: undefined,
    AudioContext: window.AudioContext || window.webkitAudioContext,
    audioRunning: false,

    keyDown: function (notePressed) {
        audio.key.keyDown(notePressed);
    },

    keyUp: function (notePressed) {
        audio.key.keyUp(notePressed);
    },

    constructorMap: {
        gen: sCGen,
        mix: sCMix,
        delay: sCDelay,
        adsr: sCAdsr,
        mainOut: sCOut
    },
    
    createSComp: function (data) {
        var workspace = document.getElementById("workspace");
        
        if (audio.constructorMap.hasOwnProperty(data.sId)) {
            audio.constructorMap[data.sId](workspace, data.sArgs).move(data.x, data.y);
        } else {
            log.error("dont know sId:" + data.sId);
        }
    },
    
    initSComp: function () {
        var workspace = document.getElementById("workspace");

        audio.key = sCVKey(workspace).move(0, app.screen.minY);
        audio.scope = sCScope(workspace).move(0, audio.key.getY() + audio.key.getH());
        
        workspace.onopencontextmenu = function (e) {
            var menu = gMenu(workspace).move(e.pageX - 20, e.pageY - 20),
                sConstructor;
            
            function menuEntry(id, xPos, yPos) {
                return function () {
                    audio.createSComp({sId: id, x: xPos, y: yPos});
                    menu.remove();
                };
            }
            
            for (sConstructor in audio.constructorMap) {
                if (audio.constructorMap.hasOwnProperty(sConstructor)) {
                    menu.add(sConstructor, menuEntry(sConstructor, e.pageX, e.pageY));
                }
            }
        };
    },
    
    workspaceData: function () {
        var workspace = document.getElementById("workspace"),
            nodes =  workspace.childNodes,
            i,
            data = {
                app: app,
                workspace: []
            };
        
        for (i = 0; i < nodes.length; i += 1) {
            if (nodes[i].sCData) {
                data.workspace.push(nodes[i].sCData());
            }
        }
        return data;
    },
    
    loadWorkspace: function (data) {
        var i;
        log.info("loading from version: " + data.app.ver);
        for (i = 0; i < data.workspace.length; i += 1) {
            audio.createSComp(data.workspace[i]);
        }
    },
    
    startAudio: function (freq) {
        var workspace = document.getElementById("workspace");
        
        if (audio.audioRunning) {
            return false;
        }
        
        audio.audioCtx = new audio.AudioContext();
            
        audio.initSComp();
            
        audio.mixerOut = sMix();
        audio.mixerOut.setChanUpdatedCallback(function (chan, data) { audio.scope.drawScope(chan, data); });

        //create actual output node:
        audio.out = sOutNode(audio.audioCtx, 2, 4096);
        audio.out.setInput(audio.mixerOut);
        audio.out.connect(audio.audioCtx.destination);

        audio.audioRunning = true;
        log.info("start playback, sample rate:" + audio.out.sampleRate + " channels " + audio.out.channels);
        return true;
    },

    stopAudio: function (freq) {
        if (!audio.audioRunning) {
            return false;
        }
        audio.audioRunning = false;

        audio.out.disconnect(audio.audioCtx.destination);
        return true;
    }
};