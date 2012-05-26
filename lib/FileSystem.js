/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 5/26/12
 * Time: 7:14 AM
 * To change this template use File | Settings | File Templates.
 */

/*global require, exports, Proxy */

(function() {
    "use strict";

    var fs = require('fs'),
        console = require('console');

    function FileProxy(path, create) {
        if (fs.isDir(path)) {
            throw new Error(path + ' is not a file');
        }
        else if (!fs.exists(path)) {
            if (!create) {
                throw new Error(path + ' does not exist');
            }
            fs.writeFile(path, '');
        }
        var filename = path.split('/').pop();
        var props = [
            'path', 'name', 'content', 'stat', 'size', 'uid', 'gid', 'mode', 'mtime', 'atime', 'ctime'
        ];
        return Proxy.create({
            hasOwn: function(name) {
//                console.log('hasOwn ' + name);
                return props.indexOf(name) !== -1;
            },
            get: function(receiver, name) {
//                console.log('get ' + name);
                switch (name) {
                    case 'each':
                        return Object.prototype.each;
                    case 'hasOwnProperty':
                        return Object.prototype.hasOwnProperty;
                    case 'toString':
                        return function() { return '[File]'; };
                    case 'name':
                        return filename;
                    case 'path':
                        return path;
                    case 'content':
                        return fs.readFile(path);
                    case 'stat':
                    case 'length':
                        return fs.stat(path);
                    case 'size':
                        return fs.fileSize(path);
                    case 'uid':
                        return fs.stat(path).uid;
                    case 'gid':
                        return fs.stat(path).gid;
                    case 'mode':
                        return fs.stat(path).mode;
                    case 'mtime':
                        return fs.stat(path).mtime;
                    case 'atime':
                        return fs.stat(path).atime;
                    case 'ctime':
                        return fs.stat(path).ctime;
                    default:
//                        return 'default';
                        throw new Error('Invalid property "' + name + '" for File');
                }
            },
            set: function(receiver, name, value) {
//                console.log('set ' + name + ' = ' + value);
                switch (name) {
                    case 'path':
                        fs.rename(path, name);
                        path = name;
                        return true;
                    case 'content':
                        if (value.toString() === '[File]') {
                            fs.copyFile(path, value.path);
                        }
                        else {
                            fs.writeFile(path, value);
                        }
                        return true;
                    case 'mode':
                        fs.chmod(path, value);
                        return true;
                    default:
                        throw new Error('Invalid property for File');
                }
            },
            keys: function() {
//                console.log('keys');
                return props;
            },
            enumerate: function() {
//                console.log('enmuerate');
                return props;
            },
            'delete': function() {
                throw 'DELETE FILE';
            }
        });
    }

    function DirectoryProxy(path, create) {
        if (!fs.isDir(path)) {
            if (!create) {
                throw new Error('Directory ' + path + ' does not exist');
            }
            fs.mkdir(path);
        }
        return Proxy.create({
            get: function(receiver, name) {
//                console.log('get ' + name);
                switch (name) {
                    case 'name':
                        return path;
                    case 'path':
                        return path;
                    case 'length':
                        return 0;
                    case 'each':
                        return Object.prototype.each;
                    case 'hasOwnProperty':
                        return Object.prototype.hasOwnProperty;
                    case 'toString':
                        return function() { return '[Directory]'; };
                }
                if (fs.isDir(path + '/' + name)) {
                    return new DirectoryProxy(path + '/' + name);
                }
                else {
                    return new FileProxy(path + '/' + name);
                }
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
            set: function(receiver, name, value) {
                fs.writeFile(path + '/' + name, value);
                return true;
            },
            keys: function() {
                return fs.readDir(path);
            },
            enumerate: function() {
                return fs.readDir(path);
            },
            has: function(name) {
                return fs.exists(path + '/' + name);
            },
            delete: function(name) {
                return fs.unlink(path + '/' + name);
            }
        });
    }

    exports.extend({
        Directory: DirectoryProxy,
        File: FileProxy
    });

}());