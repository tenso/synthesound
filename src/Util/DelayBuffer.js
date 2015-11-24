"use strict";
/*global Float32Array*/
/*global Log*/
/*global mod*/
/*global Test*/

function DelayBuffer(len) {
    this.length = len;
    this.buffer = new Float32Array(this.length);
    this.buffer.fill(0.0);
    this.setIndex = 0;
}

DelayBuffer.prototype.get = function (delay) {
    var index = mod(this.setIndex - delay, this.length);
    return this.buffer[index];
    
};

DelayBuffer.prototype.set = function (val) {
    this.setIndex = mod(this.setIndex + 1,  this.length);
    this.buffer[this.setIndex] = val;
};

DelayBuffer.prototype.setArray = function (array) {
    var i = 0;
    for (i = 0; i < array.length; i += 1) {
        this.set(array[i]);
    }
};

DelayBuffer.prototype.toString = function () {
    var i,
        str = "";
    
    for (i = 0; i < this.buffer.length; i += 1) {
        str += this.buffer[i] + ", ";
    }
    return str;
};

function test_DelayBuffer() {
    var rb = new DelayBuffer(4);
    Test.verify(rb.get(0), 0);
    Test.verify(rb.get(1), 0);
    Test.verify(rb.get(2), 0);
    Test.verify(rb.get(3), 0);
    rb.set(0);
    rb.set(1);
    rb.set(2);
    rb.set(3);
    Test.verify(rb.get(0), 3);
    Test.verify(rb.get(1), 2);
    Test.verify(rb.get(2), 1);
    Test.verify(rb.get(3), 0);
    rb.set(4);
    Test.verify(rb.get(0), 4);
    Test.verify(rb.get(1), 3);
    Test.verify(rb.get(2), 2);
    Test.verify(rb.get(3), 1);
    rb.setArray([5, 6]);
    Test.verify(rb.get(3), 3);
    Test.verify(rb.get(1), 5);
    Test.verify(rb.get(2), 4);
    Test.verify(rb.get(0), 6);
}

Test.addTest(test_DelayBuffer, "DelayBuffer");