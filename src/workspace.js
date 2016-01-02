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
/*global lang*/
/*global tracker*/
/*global sCGlobal*/
/*global scBaseUID*/
/*global gBase*/
/*global window*/

function workspace() {
    var that = gBase().setClass("workspace").top(app.screen.minY).bottom(app.screen.maxBottom),
        out,
        scope,
        audioCtx,
        AudioContext = window.AudioContext || window.webkitAudioContext,
        audioRunning = false,
        timeTracker,
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
    
    function createSComp(data) {
        var comp;
        if (data.uid >= scBaseUID.peek()) {
            scBaseUID.bumpTo(data.uid + 1);
        }
        if (constructorMap.hasOwnProperty(data.type)) {
            comp = constructorMap[data.type](that, data.uid);
            comp.setArgs(data.sArgs);
            comp.setMs(timeTracker.currentMs());
            comp.move(data.x, data.y);
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
                    menu.add(lang.tr(sConstructor), menuEntry(sConstructor, mouse.x, mouse.y));
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
    
    function updateTime() {
        var nodes =  that.childNodes,
            i,
            sc;
        
        for (i = 0; i < nodes.length; i += 1) {
            if (typeof nodes[i].data === "function") {
                nodes[i].setMs(timeTracker.currentMs());
            }
        }
        
        if (typeof that.timeUpdated === "function") {
            that.timeUpdated(timeTracker.timeString());
        }
    }
    
    function stepFrame(frames) {
        timeTracker.stepFrames(frames);
        updateTime();
    }
    
    function setFrames(frames) {
        timeTracker.setFrames(frames);
        updateTime();
    }
    
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

        log.info("reset tracker time");
        timeTracker.setFrames(0);
                
        uidOffset = scBaseUID.peek();
        log.info("workspace uid: " + uidOffset + ", offset loaddata");
        offsetDataUid(data, uidOffset);
        log.info("create components");
        for (i = 0; i < data.workspace.length; i += 1) {
            inSComp = createSComp(data.workspace[i]);
        }
        
        log.info("create connections");
        for (i = 0; i < data.connections.length; i += 1) {
            addConnection(data.connections[i]);
        }
        
        if (that.onworkspacechanged) {
            that.onworkspacechanged();
        }
    };
    
    that.init = function () {
        if (!test.verifyFunctionality(AudioContext, "audio.AudioContext") ||
                !test.verifyFunctionality(Array.prototype.fill, "Array.fill")) {
            return false;
        }
        audioCtx = new AudioContext();
        initSComp();
        that.mixerOut = sMix();

        //create actual output node:
        out = sOutNode(audioCtx, 2, 4096);
        out.setInput(that.mixerOut);
        log.info("init audio, sample rate:" + out.sampleRate + " channels " + out.channels);
        
        timeTracker = tracker(that.sampleRate());
        out.runIndexUpdated = stepFrame;
        setFrames(0);
        
        return true;
    };
    
    that.sampleRate = function () {
        return out.sampleRate;
    };
    
    that.play = function () {
        if (audioRunning) {
            return false;
        }
                
        out.connect(audioCtx.destination);
        audioRunning = true;
        return true;
    };

    that.stop = function (freq) {
        if (!audioRunning) {
            return false;
        }
        audioRunning = false;

        out.disconnect(audioCtx.destination);
        return true;
    };
    
    
    that.key = undefined; /*FIXME: globally coupled to sCVKey*/
    that.mixerOut = undefined; /*FIXME: globally coupled to sCOut*/
    that.onworkspacechanged = undefined;
    
    sCGlobal.currentUpdated = function (comp) {
        log.d("show comp:" + comp.uid());
    };
    
    that.typeIs = "workspace";
    
    return that;
}