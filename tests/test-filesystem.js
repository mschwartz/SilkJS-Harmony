/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 5/26/12
 * Time: 7:42 AM
 * To change this template use File | Settings | File Templates.
 */

/*global require */

(function() {
    "use strict";

    require.path.unshift('lib');

    var con = require('console');

    var Directory = require('FileSystem').Directory,
        File = require('FileSystem').File,
        stdio = require('stdio').stdio;

    var current = new Directory('.');
    stdio.stdout = 'CURRENT DIRECTORY';
    current.each(function(f) {
        stdio.stdout = f.name;
    });
    stdio.stdout = '----------------------';
    var readme = current['README.md'];
    stdio.stdout = 'CONTENTS OF README';
    try {
        readme.each(function(value, key) {
            stdio.stdout = (key + ' = ' + value);
        });
    }
    catch (e) {
        stdio.dump = e;
        stdio.stdout = e.stack;
    }

    stdio.stdout = 'CREATE TEST';
    var test = new File('test', true);
    test.content = 'TEST';
    stdio.stdout = typeof test;

    stdio.stdout = test.toString();
    stdio.stdout = test;
    stdio.stdout = test.content;

    stdio.stdout = 'TEST FILE COPY';
    test.content = readme;
    stdio.stdout = test.content;

    delete current.test;
}());
