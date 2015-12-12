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
/*global gIO*/

var audio = {
    mixerOut: undefined,
    out: undefined,
    key: undefined,
    scope: undefined,
    AudioContext: window.AudioContext || window.webkitAudioContext,
    audioRunning: false,
    workspace: undefined,

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
        if (audio.constructorMap.hasOwnProperty(data.sId)) {
            return audio.constructorMap[data.sId](audio.workspace, data.sArgs).move(data.x, data.y);
        } else {
            log.error("dont know sId:" + data.sId);
        }
        return undefined;
    },
    
    initSComp: function () {
        audio.key = sCVKey(audio.workspace).move(0, app.screen.minY);
        audio.scope = sCScope(audio.workspace).move(0, audio.key.getY() + audio.key.getH());
        
        audio.workspace.onopencontextmenu = function (e) {
            var menu = gMenu(audio.workspace).move(e.pageX - 20, e.pageY - 20),
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
        var nodes =  audio.workspace.childNodes,
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
        var i,
            j,
            inSComp,
            outSComp;
        
        log.info("loading from version: " + data.app.ver);
        
        log.info("create components");
        for (i = 0; i < data.workspace.length; i += 1) {
            inSComp = audio.createSComp(data.workspace[i]);
            inSComp.setSCompUID(data.workspace[i].uid);
        }
        
        log.info("create connections");
        for (i = 0; i < data.workspace.length; i += 1) {
            inSComp = audio.findSCComp(data.workspace[i].uid);
            if (inSComp) {
                for (j = 0; j < data.workspace[i].inputs.length; j += 1) {
                    outSComp = audio.findSCComp(data.workspace[i].inputs[j].uid);
                    
                    if (outSComp) {
                        gIO.connectPorts(outSComp.getPort(true, ""), inSComp.getPort(false, data.workspace[i].inputs[j].type));
                    } else {
                        log.error("could not find (output) uid:" + data.workspace[i].inputs[j].uid);
                    }
                }
            } else {
                log.error("could not find (input) uid:" + data.workspace[i].uid);
            }
        }
    },
    
    findSCComp: function (uid) {
        var nodes =  audio.workspace.childNodes,
            i;
        
        for (i = 0; i < nodes.length; i += 1) {
            if (nodes[i].sComp) {
                if (nodes[i].uid() === uid) {
                    return nodes[i];
                }
            }
        }
        return undefined;
    },
    
    startAudio: function (freq) {
        if (audio.audioRunning) {
            return false;
        }
        
        audio.workspace = document.getElementById("workspace");
        
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