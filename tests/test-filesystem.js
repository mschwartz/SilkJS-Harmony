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

    var Directory = require('FileSystem').Directory,
        File = require('FileSystem').File,
        stdio = require('stdio').stdio;

    var current = new Directory('.');
    stdio.stdout = 'Directory Proxy Properties';
    current.each(function(value, key) {
        stdio.stdout = ' + ' + key;
    });
    stdio.stdout = '----------------------';
    stdio.stdout = 'LISTING OF CURRENT DIRECTORY';
    current.content.each(function(filename) {
        stdio.stdout = current[filename].name + ' ' + current[filename].size;
    });
    stdio.stdout = '----------------------';
    stdio.stdout = 'DUMP CURRENT DIRECTORY';
    current.each(function(value, key) {
        stdio.stdout = 'key = ' + key;
        stdio.stdout = value;
    });
    stdio.stdout = '----------------------';
    stdio.stdout = 'ATTRIBUTES OF EXISTING FILE test.txt';
    var test_txt = current['test.txt'];
    test_txt.each(function(value, key) {
        stdio.stdout = (key + ' = ' + value);
    });

    stdio.stdout = '----------------------';
    stdio.stdout = 'CREATE NEW FILE test';
    stdio.stdout = 'test exists? (should be false): ' + ('test' in current);
    var test = new File('test', true);
    stdio.stdout = 'test exists? (should be true): ' + ('test' in current);

    test.content = 'TEST';

    stdio.stdout = test;
    stdio.stdout = test.content;

    stdio.stdout = '----------------------';
    stdio.stdout = 'TEST FILE COPY';
    test.content = test_txt;
    stdio.stdout = test.content;

    stdio.stdout = '----------------------';
    stdio.stdout = 'DELETE FILE test';
    stdio.stdout = 'test exists? (should be true): ' + ('test' in current);
    delete current.test;
    stdio.stdout = 'test exists? (should be false): ' + ('test' in current);
}());
