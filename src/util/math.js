"use strict";

/*global test*/

var mUtil = {
    mod: function (arg, base) {
        if (base < 0) {
            base = -base;
        }
        if (arg < 0) {
            return base - ((-arg) % base);
        }
        return arg % base;
    },

    test_mod: function () {
        test.verify(mUtil.mod(-1, 4), 3);
        test.verify(mUtil.mod(-4, 12), 8);
        test.verify(mUtil.mod(4, 12), 4);
        test.verify(mUtil.mod(3, 2), 1);
        test.verify(mUtil.mod(-1, 1), 1);
        test.verify(mUtil.mod(-3, 3), 3);
        test.verify(mUtil.mod(3, 3), 0);
        test.verify(mUtil.mod(3, -3), 0);
        test.verify(mUtil.mod(-1, -3), 2);
        test.verify(mUtil.mod(-4, -3), 2);
        test.verify(mUtil.mod(-4, 3), 2);
        test.verify(mUtil.mod(4, -3), 1);
        test.verify(mUtil.mod(-48000, 480000), 432000);
    }
};
test.addTest(mUtil.test_mod, "mUtil.mod()");