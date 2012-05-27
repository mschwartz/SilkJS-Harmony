/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 5/27/12
 * Time: 8:36 AM
 * To change this template use File | Settings | File Templates.
 */

/*global require */

(function() {
    "use strict";

    require.path.unshift('lib');

    var stdio = require('stdio').stdio;

    stdio.prompt = 'Enter username: ';
    var user = stdio.stdin;
    stdio.prompt = 'Enter password: ';
    var password = stdio.password;

    stdio.stdout = 'You entered: ' + user + '/' + password;
    stdio.stdout = {
        username: user,
        password: password
    };
}());
