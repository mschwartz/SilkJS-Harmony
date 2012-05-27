/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 5/27/12
 * Time: 9:19 AM
 * To change this template use File | Settings | File Templates.
 */

/*global require */
(function() {
    "use strict";

    require.path.unshift('lib');

    var File = require('FileSystem').File,
        stdio = require('stdio').stdio;

    stdio.stdout = 'Testing existing file';
    var test_txt = new File('test.txt');
    test_txt.each(function(value, key) {
        stdio.stdout = key;
        stdio.stdout = value;
    });
    stdio.stdout = '-------------------';

    stdio.stdout = 'Testing new file';
    var test2_txt = new File('test2.txt', true);   // true means create it if it doesn't exist
    test2_txt.content = 'This is content\nwritten to\ntest2.txt\n';
    test2_txt.each(function(value, key) {
        stdio.stdout = key;
        stdio.stdout = value;
    });

}());