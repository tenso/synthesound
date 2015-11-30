"use strict";

/*global Float32Array*/
/*global log*/
/*global mUtil*/
/*global test*/

function delayBuffer(len) {
    var that = {},
        length = len,
        buffer = new Float32Array(length),
        setIndex = 0;
        
    buffer.fill(0.0);
    
    that.length = function () {
        return length;
    };
    
    that.get = function (delay) {
        var index = mUtil.mod(setIndex - delay, length);
        return buffer[index];
    };

    that.set = function (val) {
        setIndex = mUtil.mod(setIndex + 1,  length);
        buffer[setIndex] = val;
    };

    that.setArray = function (array) {
        var i = 0;
        for (i = 0; i < array.length; i += 1) {
            that.set(array[i]);
        }
    };

    that.toString = function () {
        var i,
            str = "";

        for (i = 0; i < buffer.length; i += 1) {
            str += buffer[i] + ", ";
        }
        return str;
    };
    return that;
}

function test_delayBuffer() {
    var rb = delayBuffer(4);
    test.verify(rb.get(0), 0);
    test.verify(rb.get(1), 0);
    test.verify(rb.get(2), 0);
    test.verify(rb.get(3), 0);
    rb.set(0);
    rb.set(1);
    rb.set(2);
    rb.set(3);
    test.verify(rb.get(0), 3);
    test.verify(rb.get(1), 2);
    test.verify(rb.get(2), 1);
    test.verify(rb.get(3), 0);
    rb.set(4);
    test.verify(rb.get(0), 4);
    test.verify(rb.get(1), 3);
    test.verify(rb.get(2), 2);
    test.verify(rb.get(3), 1);
    rb.setArray([5, 6]);
    test.verify(rb.get(3), 3);
    test.verify(rb.get(1), 5);
    test.verify(rb.get(2), 4);
    test.verify(rb.get(0), 6);
}

test.addTest(test_delayBuffer, "DelayBuffer");