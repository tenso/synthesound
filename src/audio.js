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
/*global sCConst*/
/*global sCOp*/
/*global sCNotePitch*/
/*global gui*/
/*global wMenu*/
/*global app*/
/*global gIO*/
/*global util*/


/*global scBaseUID*/

var audio = {
    mixerOut: undefined, /*FIXME: globally coupled to sCOut*/
    out: undefined,
    key: undefined, /*FIXME: globally coupled to sCVKey*/
    scope: undefined,
    AudioContext: window.AudioContext || window.webkitAudioContext,
    audioRunning: false,
    workspace: undefined,

    keyDown: function (notePressed) {
        if (audio.key) {
            audio.key.keyDown(notePressed);
        }
    },

    keyUp: function (notePressed) {
        if (audio.key) {
            audio.key.keyUp(notePressed);
        }
    },

    constructorMap: {
        sCGen: sCGen,
        sCMix: sCMix,
        sCDelay: sCDelay,
        sCAdsr: sCAdsr,
        sCOut: sCOut,
        sCVKey: sCVKey,
        sCScope: sCScope,
        sCConst: sCConst,
        sCOp: sCOp,
        sCNotePitch: sCNotePitch
    },
    
    createSComp: function (data, uid) {
        if (uid >= scBaseUID.peek()) {
            scBaseUID.bumpTo(uid + 1);
        }
        if (audio.constructorMap.hasOwnProperty(data.type)) {
            return audio.constructorMap[data.type](audio.workspace, data.sArgs, uid).move(data.x, data.y);
        } else {
            log.error("workspace: dont know sId:" + data.type);
        }
        return undefined;
    },
    
    initSComp: function () {
    
        audio.workspace.iOpenContextMenu = function (e, mouse) {
            var menu = wMenu(audio.workspace).move(mouse.x - 20, mouse.y - 20),
                sConstructor;
            
            function menuEntry(id, xPos, yPos) {
                return function () {
                    audio.createSComp({type: id, x: xPos, y: yPos});
                    menu.remove();
                };
            }
            
            for (sConstructor in audio.constructorMap) {
                if (audio.constructorMap.hasOwnProperty(sConstructor)) {
                    menu.add(sConstructor, menuEntry(sConstructor, mouse.x, mouse.y));
                }
            }
        };
    },
    
    data: function () {
        var nodes =  audio.workspace.childNodes,
            i,
            data = {
                app: app,
                workspace: []
            };
        
        //assumptions is that if it has a data property it should be saved.
        for (i = 0; i < nodes.length; i += 1) {
            if (typeof nodes[i].data === "function") {
                data.workspace.push(nodes[i].data());
            }
        }
        
        data.connections = gIO.data();
        
        return data;
    },
    
    addConnection: function (con) {
        var toSCComp,
            toPort,
            fromSCComp,
            fromPort;
        
        toSCComp = audio.findSCComp(con.to.uid);
        fromSCComp = audio.findSCComp(con.from.uid);
        
        if (toSCComp && fromSCComp) {
            toPort = toSCComp.getPort(con.to.portName, con.to.isOut, con.to.portType);
            fromPort = fromSCComp.getPort(con.from.portName, con.from.isOut, con.from.portType);

            if (toPort && fromPort) {
                gIO.connectPorts(fromPort, toPort);
            } else {
                log.error("did not find ports");
            }
        } else {
            log.error("did not find comps");
            log.obj(con);
        }
    },
    
    offsetDataUid: function (data, offset) {
        var param;
        for (param in data) {
            if (data.hasOwnProperty(param)) {
                if (util.isCollection(data[param])) {
                    audio.offsetDataUid(data[param], offset);
                } else if (param === "uid") {
                    data[param] += offset;
                }
            }
        }
    },
    
    loadWorkspace: function (data) {
        var i,
            j,
            inSComp,
            uidOffset = 0;
        
        log.info("loading from version: " + data.app.ver);

        uidOffset = scBaseUID.peek();
        log.info("workspace uid: " + uidOffset + ", offset loaddata");
        audio.offsetDataUid(data, uidOffset);
        log.info("create components");
        for (i = 0; i < data.workspace.length; i += 1) {
            inSComp = audio.createSComp(data.workspace[i], data.workspace[i].uid);
        }
        
        log.info("create connections");
        for (i = 0; i < data.connections.length; i += 1) {
            audio.addConnection(data.connections[i]);
        }
        
        if (audio.onworkspacechanged) {
            audio.onworkspacechanged();
        }
    },
    
    findSCComp: function (uid) {
        var nodes =  audio.workspace.childNodes,
            i;
        
        for (i = 0; i < nodes.length; i += 1) {
            if (nodes[i].uid) {
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