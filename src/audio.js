"use strict";
/*global log*/
/*global test*/
/*global sOutNode*/
/*global sMix*/
/*global gScope*/
/*global sCOut*/
/*global sCGen*/
/*global sCVKey*/
/*global sCAdsr*/
/*global sCDelay*/
/*global sCMix*/
/*global gui*/

var audio = {
    generators: [],
    mixer: undefined,
    mixerOut: undefined,
    adsr: undefined,
    delay: undefined,
    out: undefined,
    key: undefined,
    scope: [],
    AudioContext: window.AudioContext || window.webkitAudioContext,
    audioRunning: false,
    scout: undefined,

    keyDown: function (notePressed) {
        audio.key.keyDown(notePressed);
    },

    keyUp: function (notePressed) {
        audio.key.keyUp(notePressed);
    },

    drawScopes: function (chan, data) {
        audio.scope[chan].drawGraph(data);
    },

    initSComp: function () {
        var gen,
            adsr,
            delay,
            workspace = document.getElementById("workspace"),
            mix;

        audio.scout = sCOut(workspace).move(400, 150);
        gen = sCGen(workspace).move(10, 50);
        gen = sCGen(workspace).move(250, 50);
        gen = sCGen(workspace).move(500, 50);
        adsr = sCAdsr(workspace).move(10, 150);
        delay = sCDelay(workspace).move(250, 150);
        mix = sCMix(workspace).move(500, 150);
        audio.key = sCVKey(workspace).move(10, 350);
    },

    startAudio: function (freq) {
        var workspace = document.getElementById("workspace");
        
        if (audio.audioRunning) {
            return false;
        }
        
        test.verifyFunctionality(audio.AudioContext, "audio.AudioContext");
        test.verifyFunctionality(Array.prototype.fill, "Array fill");
        audio.audioCtx = new audio.AudioContext();
            
        audio.initSComp();
            
        audio.mixerOut = sMix();
        audio.mixerOut.addInput(audio.scout.getOutput());

        //create actual output node:
        audio.out = sOutNode(audio.audioCtx, 2, 4096);
        audio.out.setInput(audio.mixerOut);
        audio.out.connect(audio.audioCtx.destination);

        audio.scope[0] = gScope(workspace, 0).move(1000,0);
        audio.scope[1] = gScope(workspace, 1).move(1000,200);
        audio.mixerOut.setChanUpdatedCallback(function (chan, data) { audio.drawScopes(chan, data); });

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