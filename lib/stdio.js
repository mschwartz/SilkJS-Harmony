/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 5/26/12
 * Time: 6:59 AM
 * To change this template use File | Settings | File Templates.
 */

/*global require, exports, Proxy */
(function() {
    "use strict";

    var console = require('console'),
        ReadLine = require('ReadLine');

    function isString(v) {
        return typeof v === 'string';
    }

    var proto = [ 'stdout', 'prompt', 'password', 'stdin' ];
    function stdio() {
        var stdin = new ReadLine('harmony');
        var prompt = '> ';
        stdin.prompt(prompt);
        return Proxy.create({
            get: function(receiver, name) {
                if (name === 'passwd' || name === 'password') {
                    return console.getPassword(prompt);
                }
                else if (name === 'stdin') {
                    return stdin.gets();
                }
                else {
                    throw new Error('stdio cannot get ' + name);
                }
            },
            set: function(receiver, name, value) {
                switch (name) {
                    case 'prompt':
                        prompt = value;
                        stdin.prompt(prompt);
                        break;
                    case 'stdout':
                        if (isString(value)) {
                            console.log(value);
                        }
                        else {
                            console.dir(value);
                        }
                        break;
                }
                return true;
            },
            keys: function() {
                return proto;
            },
            enumerate: function() {
                return proto;
            },
            has: function(name) {
                return name in proto;
            },
            'delete': function(name) {
            }
        });
    }

    exports.extend({
        stdio: stdio()
    });

}());

