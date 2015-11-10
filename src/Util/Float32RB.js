"use strict";
/*global Float32Array*/
/*global logError*/
/*global verify*/
/*global addTest*/

function Float32RB(len) {
    this.bufferSize = len + 1;
    this.buffer = new Float32Array(this.bufferSize);
    this.buffer.fill(0);
    this.setIndex = 0;
    this.getIndex = 0;
}

Float32RB.prototype.get = function () {
    var retVal = this.buffer[this.getIndex];
    this.getIndex += 1;
    this.getIndex %= this.bufferSize;
    return retVal;
};

Float32RB.prototype.set = function (val) {
    this.buffer[this.setIndex] = val;
    this.setIndex += 1;
    this.setIndex %= this.bufferSize;
};

Float32RB.prototype.count = function () {
    if (this.setIndex >= this.getIndex) {
        return this.setIndex - this.getIndex;
    } else {
        return this.bufferSize - this.getIndex - this.setIndex;
    }
    
};

Float32RB.prototype.toString = function () {
    var i,
        str = "";
    
    for (i = 0; i < this.buffer.length; i += 1) {
        str += this.buffer[i] + ", ";
    }
    return str;
};

function test_Float32RB() {
    var rb = new Float32RB(4);
    verify(rb.count(), 0);
    rb.set(0);
    rb.set(1);
    verify(rb.count(), 2);
    
    rb.set(2);
    rb.set(3);
    verify(rb.count(), 4);
    
    verify(rb.get(), 0);
    verify(rb.get(), 1);
    verify(rb.count(), 2);
    verify(rb.get(), 2);
    verify(rb.get(), 3);
    verify(rb.count(), 0);
        
    rb.set(4);
    rb.set(5);
    verify(rb.get(), 4);
    verify(rb.count(), 1);
    rb.set(6);
    rb.set(7);
    verify(rb.count(), 3);
    verify(rb.get(), 5);
    verify(rb.count(), 2);
    verify(rb.get(), 6);
    verify(rb.count(), 1);
    verify(rb.get(), 7);
    verify(rb.count(), 0);
}

addTest(test_Float32RB, "Float32RB");