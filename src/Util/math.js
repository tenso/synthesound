"use strict";

/*global Test*/

function mod(arg, base) {
    if (base < 0) {
        base = -base;
    }
    if (arg < 0) {
        return base - ((-arg) % base);
    }
    return arg % base;
}

function test_mod() {
    Test.verify(mod(-1, 4), 3);
    Test.verify(mod(-4, 12), 8);
    Test.verify(mod(4, 12), 4);
    Test.verify(mod(3, 2), 1);
    Test.verify(mod(-1, 1), 1);
    Test.verify(mod(-3, 3), 3);
    Test.verify(mod(3, 3), 0);
    Test.verify(mod(3, -3), 0);
    Test.verify(mod(-1, -3), 2);
    Test.verify(mod(-4, -3), 2);
    Test.verify(mod(-4, 3), 2);
    Test.verify(mod(4, -3), 1);
    Test.verify(mod(-48000, 480000), 432000);
}
Test.addTest(test_mod, "mod()");