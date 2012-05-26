/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 5/26/12
 * Time: 9:44 AM
 * To change this template use File | Settings | File Templates.
 */

/*global require */

(function() {
    "use strict";

    require.path.unshift('lib');

    var stdio = require('stdio').stdio,
        Memcache = require('Memcache').Memcache;

//    stdio = new stdio.stdio();
    var mc = new Memcache('localhost');

    mc.foo = mc.foo || 0;
    mc.foo++;
    mc.bar = { a: 1, b: 2};
    stdio.out = mc.foo;
}());
