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

function workspace(container) {
    var that = document.createElement("div"),
        out,
        scope,
        audioCtx,
        AudioContext = window.AudioContext || window.webkitAudioContext,
        audioRunning = false,
        constructorMap = {
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
        };
    
    that.className = "workspace";
    
    that.key = undefined; /*FIXME: globally coupled to sCVKey*/
    that.mixerOut = undefined; /*FIXME: globally coupled to sCOut*/
    that.onworkspacechanged = undefined;
    
    container.appendChild(that);

    function findSCComp(uid) {
        var nodes =  that.childNodes,
            i;
        
        for (i = 0; i < nodes.length; i += 1) {
            if (nodes[i].uid) {
                if (nodes[i].uid() === uid) {
                    return nodes[i];
                }
            }
        }
        return undefined;
    }
    
    function createSComp(data, uid) {
        if (uid >= scBaseUID.peek()) {
            scBaseUID.bumpTo(uid + 1);
        }
        if (constructorMap.hasOwnProperty(data.type)) {
            return constructorMap[data.type](that, data.sArgs, uid).move(data.x, data.y);
        } else {
            log.error("workspace: dont know sId:" + data.type);
        }
        return undefined;
    }
    
    function initSComp() {
        that.iOpenContextMenu = function (e, mouse) {
            var menu = wMenu(that).move(mouse.x - 20, mouse.y - 20),
                sConstructor;
            
            function menuEntry(id, xPos, yPos) {
                return function () {
                    createSComp({type: id, x: xPos, y: yPos});
                    menu.remove();
                };
            }
            
            for (sConstructor in constructorMap) {
                if (constructorMap.hasOwnProperty(sConstructor)) {
                    menu.add(sConstructor, menuEntry(sConstructor, mouse.x, mouse.y));
                }
            }
        };
    }
    
    function addConnection(con) {
        var toSCComp,
            toPort,
            fromSCComp,
            fromPort;
        
        toSCComp = findSCComp(con.to.uid);
        fromSCComp = findSCComp(con.from.uid);
        
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
    }
    
    function offsetDataUid(data, offset) {
        var param;
        for (param in data) {
            if (data.hasOwnProperty(param)) {
                if (util.isCollection(data[param])) {
                    offsetDataUid(data[param], offset);
                } else if (param === "uid") {
                    data[param] += offset;
                }
            }
        }
    }

    that.keyDown = function (notePressed) {
        if (that.key) {
            that.key.keyDown(notePressed);
        }
    };

    that.keyUp = function (notePressed) {
        if (that.key) {
            that.key.keyUp(notePressed);
        }
    };
    
    that.data = function () {
        var nodes =  that.childNodes,
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
    };
    
    that.loadWorkspace = function (data) {
        var i,
            j,
            inSComp,
            uidOffset = 0;
        
        log.info("loading from version: " + data.app.ver);

        uidOffset = scBaseUID.peek();
        log.info("workspace uid: " + uidOffset + ", offset loaddata");
        offsetDataUid(data, uidOffset);
        log.info("create components");
        for (i = 0; i < data.workspace.length; i += 1) {
            inSComp = createSComp(data.workspace[i], data.workspace[i].uid);
        }
        
        log.info("create connections");
        for (i = 0; i < data.connections.length; i += 1) {
            addConnection(data.connections[i]);
        }
        
        if (that.onworkspacechanged) {
            that.onworkspacechanged();
        }
    };
    
    that.startAudio = function (freq) {
        
        if (!test.verifyFunctionality(AudioContext, "audio.AudioContext") ||
                !test.verifyFunctionality(Array.prototype.fill, "Array.fill")) {
            return false;
        }
        
        if (audioRunning) {
            return false;
        }
                
        audioCtx = new AudioContext();
        initSComp();
        that.mixerOut = sMix();

        //create actual output node:
        out = sOutNode(audioCtx, 2, 4096);
        out.setInput(that.mixerOut);
        out.connect(audioCtx.destination);

        audioRunning = true;
        log.info("start playback, sample rate:" + out.sampleRate + " channels " + out.channels);
        return true;
    };

    that.stopAudio = function (freq) {
        if (!audioRunning) {
            return false;
        }
        audioRunning = false;

        out.disconnect(audioCtx.destination);
        return true;
    };
    return that;
}