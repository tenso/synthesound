"use strict";
/*global log*/
/*global test*/
/*global sOutNode*/
/*global sGen*/
/*global sMix*/
/*global sAdsr*/
/*global sDelay*/
/*global gScope*/
/*global sCOut*/
/*global sCGen*/
/*global sCVKey*/
/*global note*/

var audio = {
    generators: [],
    mixer: undefined,
    mixerOut: undefined,
    adsr: undefined,
    delay: undefined,
    out: undefined,
    scope: [],
    AudioContext: window.AudioContext || window.webkitAudioContext,
    audioRunning: false,
    scout: undefined,

    keyDown: function (notePressed) {
        var freq = note.hz(notePressed);

        if (audio.generators.length === 0) {
            return false;
        }
        audio.generators[0].setArgs({"freq": freq});
        audio.generators[1].setArgs({"freq": freq * 2});
        audio.generators[2].setArgs({"freq": freq * 4});
        
        audio.adsr.setArgs({"active": false});
        audio.adsr.setArgs({"active": true});

        return true;
    },

    keyUp: function (notePressed) {
        if (audio.adsr) {
            audio.adsr.setArgs({"active": false});
        }
    },

    drawScopes: function (chan, data) {
        audio.scope[chan].drawGraph(data);
    },

    initSComp: function () {
        var gen,
            key;

        audio.scout = sCOut(document.getElementById("scout"));

        gen = sCGen(document.getElementById("scgen0"));
        gen = sCGen(document.getElementById("scgen1"));
        gen = sCGen(document.getElementById("scgen2"));
        key = sCVKey(document.getElementById("scvkey"));
    },

    startAudio: function (freq) {
        if (audio.audioRunning) {
            return false;
        }
        
        test.verifyFunctionality(audio.AudioContext, "audio.AudioContext");
        test.verifyFunctionality(Array.prototype.fill, "Array fill");
        audio.audioCtx = new audio.AudioContext();
            
        audio.initSComp();

        audio.mixer = sMix();
        audio.generators[0] = sGen({"freq": 220, "amp": 0.25, "type": "sine"});
        audio.generators[1] = sGen({"freq": 220, "amp": 0.25, "type": "sine"});
        audio.generators[2] = sGen({"freq": 110, "amp": 0.25, "type": "sine"});
        
        audio.mixer.addInput(audio.generators[0]);
        audio.mixer.addInput(audio.generators[1]);
        audio.mixer.addInput(audio.generators[2]);

        audio.mixer.setArgs({"gainL": 0.5, "gainR": 0.5});
        
        audio.adsr = sAdsr({"a": 0.01, "d": 0.15, "s": 0.25, "r": 0.01});
        audio.adsr.addInput(audio.mixer);

        audio.delay = sDelay({"delay": 0.03, "gain": 0.7});
        
        audio.mixerOut = sMix();
        audio.mixerOut.addInput(audio.adsr);

        audio.mixerOut.addInput(audio.delay);
        audio.delay.addInput(audio.mixerOut);

        audio.mixerOut.addInput(audio.scout.getOutput());

        //create actual output node:
        audio.out = sOutNode(audio.audioCtx, 2, 4096);
        audio.out.setInput(audio.mixerOut);
        audio.out.connect(audio.audioCtx.destination);

        audio.scope[0] = gScope(document.getElementById("audioScopeL"), 0);
        audio.scope[1] = gScope(document.getElementById("audioScopeR"), 1);
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