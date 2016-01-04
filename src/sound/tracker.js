"use strict";

/*global test*/
/*global util*/

function tracker(sampleRate) {
    var that = {},
        bpm = 60,
        currentMs = 0,
        quantization = 1,
        currentFrame = 0,
        totalMs = 60000;

    that.data = function () {
        return {
            bpm: bpm,
            totalMs: totalMs,
            quantization: quantization,
            currentMs: currentMs
        };
    };

    that.load = function (data) {
        bpm = data.bpm;
        totalMs = data.totalMs;
        quantization = data.quantization;
        currentMs = data.currentMs;
    };

    that.setBpm = function (value) {
        bpm = value;
    };

    that.bpm = function () {
        return bpm;
    };

    that.setTotalMs = function (value) {
        totalMs = value;
    };

    that.totalMs = function () {
        return totalMs;
    };

    that.setQuantization = function (value) {
        quantization = value;
    };

    that.setFrames = function (frames) {
        currentFrame = frames;
        currentMs = parseInt(1000 * currentFrame / sampleRate, 10);
    };

    that.stepFrames = function (frames) {
        currentFrame += frames;
        currentMs = parseInt(1000 * currentFrame / sampleRate, 10);
    };

    that.setCurrentMs = function (ms) {
        currentMs = ms;
        currentFrame = parseInt(currentMs * sampleRate / 1000, 10);
    }

    that.currentMs = function () {
        return currentMs;
    };

    that.measureMs = function () {
        var msecPerBeat = 60000 / bpm;
        return parseInt(msecPerBeat * quantization, 10);
    };

    that.currentMeasure = function () {
        return parseInt(currentMs / that.measureMs(), 10);
    };

    that.currentMsQuantized = function () {
        return that.currentMeasure() * that.measureMs();
    };

    that.timeString = function () {
        var seconds = parseInt(currentMs / 1000.0, 10);
        return util.zeroPad(seconds / 60) + ":" + util.zeroPad(seconds % 60) + ":" + util.zeroPad((currentMs % 1000) / 10);
    };

    return that;
}

function test_tracker() {
    var sRate = 48000,
        track = tracker(sRate),
        tenth = parseInt(sRate / 10, 10),
        quarter = parseInt(sRate / 4, 10),
        full = parseInt(sRate, 10);

    track.setBpm(120);
    track.setQuantization(0.5);

    test.verify(track.measureMs(), 250);

    test.verify(track.currentMs(), 0);
    test.verify(track.currentMeasure(), 0);
    test.verify(track.currentMsQuantized(), 0);
    test.verify(track.timeString(), "00:00:00");

    track.stepFrames(tenth);
    test.verify(track.currentMs(), 100);
    test.verify(track.currentMeasure(), 0);
    test.verify(track.currentMsQuantized(), 0);
    test.verify(track.timeString(), "00:00:10");

    track.stepFrames(9 * tenth);
    test.verify(track.currentMs(), 1000);
    test.verify(track.currentMeasure(), 4);
    test.verify(track.currentMsQuantized(), 1000);
    test.verify(track.timeString(), "00:01:00");

    track.stepFrames(quarter);
    test.verify(track.currentMs(), 1250);
    test.verify(track.currentMeasure(), 5);
    test.verify(track.currentMsQuantized(), 1250);
    test.verify(track.timeString(), "00:01:25");

    track.stepFrames(tenth);
    test.verify(track.currentMs(), 1350);
    test.verify(track.currentMeasure(), 5);
    test.verify(track.currentMsQuantized(), 1250);
    test.verify(track.timeString(), "00:01:35");

    track.stepFrames(quarter + 4 * tenth);
    test.verify(track.currentMs(), 2000);
    test.verify(track.currentMeasure(), 8);
    test.verify(track.currentMsQuantized(), 2000);
    test.verify(track.timeString(), "00:02:00");

    track.stepFrames(full * 60);//+1min
    test.verify(track.currentMs(), 62000);
    test.verify(track.currentMeasure(), 4 * 60 + 8);
    test.verify(track.currentMsQuantized(), 62000);
    test.verify(track.timeString(), "01:02:00");

    track.stepFrames(full * 600);//+10min
    test.verify(track.currentMs(), 662000);
    test.verify(track.currentMeasure(), 4 * 600 + 4 * 60 + 8);
    test.verify(track.currentMsQuantized(), 662000);
    test.verify(track.timeString(), "11:02:00");

    track.stepFrames(full * 3600); //+60min +3600000ms
    test.verify(track.currentMs(), 4262000);
    test.verify(track.currentMeasure(), 4 * 3600 + 4 * 600 + 4 * 60 + 8);
    test.verify(track.currentMsQuantized(), 4262000);
    test.verify(track.timeString(), "71:02:00");
}

test.addTest(test_tracker, "test_tracker");
