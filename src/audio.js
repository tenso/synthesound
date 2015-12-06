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
    scout: undefined,

    keyDown: function (notePressed) {
        audio.key.keyDown(notePressed);
    },

    keyUp: function (notePressed) {
        audio.key.keyUp(notePressed);
    },

    initSComp: function () {
        var gen,
            adsr,
            delay,
            workspace = document.getElementById("workspace"),
            mix;

        audio.scout = sCOut(workspace).move(270, 100);
        gen = sCGen(workspace).move(0, 0);
        gen = sCGen(workspace).move(220, 0);
        gen = sCGen(workspace).move(440, 0);
        adsr = sCAdsr(workspace).move(0, 100);
        delay = sCDelay(workspace).move(170, 100);
        mix = sCMix(workspace).move(350, 100);
        audio.key = sCVKey(workspace).move(10, 350);
        
        audio.scope = sCScope(workspace).move(440, 100);
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