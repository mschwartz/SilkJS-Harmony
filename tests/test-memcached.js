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

    var mc = new Memcache('localhost');

    stdio.stdout = 'Assign to memcache';
    mc.foo = mc.foo || 0;
    mc.foo++;
    mc.bar = { a: 1, b: 2};
    stdio.stdout = 'Assure values got stored';
    stdio.stdout = mc.foo;
    stdio.stdout = mc.bar;
    stdio.stdout = 'Test iteration (each)';
    mc.each(function(value, key) {
        stdio.stdout = key;
        stdio.stdout = value;
    });

    stdio.stdout = 'Test iteration (for ... in)';
    for (var i in mc) {
        stdio.stdout = i;
        stdio.stdout = mc[i];
    }

    stdio.stdout = 'Test delete';
    stdio.stdout = 'bar exists? ' + ('bar' in mc);
    delete mc.bar;
    stdio.stdout = 'bar exists? ' + ('bar' in mc);

}());
