/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 5/26/12
 * Time: 9:00 AM
 * To change this template use File | Settings | File Templates.
 */

/*global require, exports, toString, Proxy */
(function() {
    "use strict";

    var memcached = require('builtin/memcached'),
        fs = require('fs'),
        console = require('console'),
        Json = require('Json');

    function isArray(v) {
        return toString.apply(v) === '[object Array]';
    }

    function isString(v) {
        return typeof v === 'string';
    }

    function MemcacheProxy(hosts) {
        if (isArray(hosts)) {
            hosts = hosts.join(',');
        }
        var handle = memcached.connect(hosts);
        return Proxy.create({
            get: function(receiver, name) {
                switch (name) {
                    case 'each':
                        return Object.each;
                    case 'hasOwnProperty':
                        return Object.prototype.hasOwnProperty;
                    case 'toString':
                        return function() { return '[Memcache]'; };
                }
                var o = memcached.get(handle, name);
                if (o.rc !== 0) {
                    return undefined;
                }
                return o.flags === 0 ? Json.decode(o.value) : o.value;
            },
            set: function(receiver, name, value) {
                var expires = 0;
                var flags = 0;
                if (isString(value)) {
                    flags = 1;
                }
                else {
                    value = Json.encode(value);
                }
                var rc = memcached.set(handle, name, value, expires, flags);
                if (rc !== memcached.SUCCESS) {
                    throw new Error('Memcache set failed ' + memcached.error(handle, rc) + ' ' + rc + ' ' + fs.error(rc));
                }
                return true;
            },
            getOwnPropertyDescriptor: function(name) {
//                console.log('x ' + name);
                return {
                    value: this[name],
                    writable: true,
                    configurable: true,
                    enumerable: true
                };
            },
            has: function(name) {
                return (memcached.get(handle, name) !== false);
            },
            keys: function() {
                return memcached.keys(handle);
            },
            enumerate: function() {
                return memcached.keys(handle);
            },
            'delete': function(name) {
                memcached.remove(handle, name);
                return true;
            }
        });
    }

    exports.Memcache = MemcacheProxy;

}());
