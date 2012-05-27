# SilkJS Harmony API

This is an experimental API concept built on top of the Harmony Proxy API enabled by SilkJS.

## Overview

JavaScript has had getters and setters for a while now.  Harmony Proxies allow for the interception of access to any
arbitrary member of an Object or Function.  While writing my June article for JSMag, I mused about the possibility of
using Proxys to implement server-side sessions, and then presented a possible whole new way of looking at implementing
general purpose APIs.

The Perl programming language has the concept of "tie" that allows you to programatically bind a hash array to a DBM file,
which is a persistent key/value kind of storage.  Harmony Proxies can trivially be used to implement the same thing.  In
fact, I've implemented a binding to a key/value store using memcached as the backend.

Simply binding an Object to a key/value store is just the beginning of the possibilities.  I imagine a rich API where
method and function calls are replaced by assignments to object properties.

## Console I/O

The first bit of API I present is a replacement for console.  Consider that console is an object in the browser and
server with methods for writing strings or object dumps to the debug console or terminal window.  In actuality, the
"console" has both a keyboard and a screen, or a way to enter a command and a widget for displaying console type output.

In Unix programming, we use stdin and stdout to refer to the console.  For SilkJS, the console API is still valid, but for
Harmony API, we're going to use a stdio Object instead.  Here's the stdio API in action:

```javascript
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
```

And the output:

```
mschwartz@dionysus:~/src/SilkJS-Harmony$ silkjs ./tests/test-stdio.js
Enter username: mykesx
Enter password:
You entered: mykesx/testing
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (object) :
 [username] : (string) mykesx
 [password] : (string) testing
```

Assigning to stdio.stdout causes something to be written to the console.  If the value assigned is an object, it is
the equivalent of calling console.dir(value).  If the value assigned is a primitive, it is the equivalent of calling
console.log(value);

_Note that the only function call in the example is require()._

## Memcache

As I mentioned earlier, it is trivial to implement a key/value store using Proxies.  Here is a sample program to
illustrate how natural the API is.  On my Mac, I had to run "memcached -d" from the command line.

```javascript
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
```

And the output:


```
mschwartz@dionysus:~/src/SilkJS-Harmony$ silkjs ./tests/test-memcached.js
Assign to memcache
Assure values got stored
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 24

/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (object) :
 [a] : (number) 1
 [b] : (number) 2

Test iteration (each)
bar
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (object) :
 [a] : (number) 1
 [b] : (number) 2

foo
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 24

Test iteration (for ... in)
bar
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (object) :
 [a] : (number) 1
 [b] : (number) 2

foo
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 24

Test delete
bar exists? true
bar exists? false
```

Assignment to properties, and deleting a property sure seems like an elegant interface to a key/value store
like memcached.

## FileSystem

The Unix FileSystem features files and directories, as well as other items like devices, links, and so on.  For
the purposes of experimenting with a Proxy API, I only deal with Files and Directories.  The API features just
the two Proxies: Directory() and File().

### Files

A File is a collection of properties or attributes, as well as the actual content of the file.  You use read() or fread()
in Unix programming to read in the contents of a file.  You use stat() to get the attributes of the file (e.g. owner, size,
permissions...).

The File Proxy encapsulates these calls and unifies it all as properties.

I created a file called test.txt in the root of the repository.  It's contents:
```
mschwartz@dionysus:~/src/SilkJS-Harmony$ cat test.txt
This is content
in the file
test.txt
```

Here is a simple program to test the File Proxy:
```javascript
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
```

The output of the program:

```
mschwartz@dionysus:~/src/SilkJS-Harmony$ silkjs ./tests/test-file.js
Testing existing file
path
test.txt
name
test.txt
content
This is content
in the file
test.txt


stat
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (object) :
 [dev] : (number) 234881028
 [ino] : (number) 7003320
 [mode] : (number) 33188
 [nlink] : (number) 1
 [uid] : (number) 501
 [gid] : (number) 20
 [rdev] : (number) 0
 [size] : (number) 38
 [blksize] : (number) 4096
 [blocks] : (number) 8
 [atime] : (number) 1338136797
 [mtime] : (number) 1338135180
 [ctime] : (number) 1338135180

size
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 38

uid
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 501

gid
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 20

mode
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 33188

mtime
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 1338135180

atime
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 1338136797

ctime
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 1338135180

-------------------
Testing new file
path
test2.txt
name
test2.txt
content
This is content
written to
test2.txt

stat
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (object) :
 [dev] : (number) 234881028
 [ino] : (number) 7004103
 [mode] : (number) 33188
 [nlink] : (number) 1
 [uid] : (number) 501
 [gid] : (number) 20
 [rdev] : (number) 0
 [size] : (number) 37
 [blksize] : (number) 4096
 [blocks] : (number) 8
 [atime] : (number) 1338136797
 [mtime] : (number) 1338136797
 [ctime] : (number) 1338136797

size
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 37

uid
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 501

gid
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 20

mode
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 33188

mtime
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 1338136797

atime
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 1338136797

ctime
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 1338136797
```

Note that assigning to the content property of a File writes the value to the file, and reading from the content property
reads the content of the file.  It gets interesting when you write a line like this:
```javascript
file1.content = file2.content;
```
It does what you think - it reads the entire content of file2 in, then writes it to the content of file1.  This is not
very efficient, but it works.  However, you can write a line like this:
```javascript
file1.content = file2;
```
What's going on here is the File Proxy sees you are trying to assign a File to another file's content, and it calls
SilkJS's internal fs.copyFile() method, which uses mmap() to rapidly copy the file contents.  In fact, we can enhance
the API so assigning all sorts of Proxies to the .content property make sense.  For example, assigning an Image to
the .content property would write the image to the file.

The File Proxy partially implements some obvious interactions at this point.  If you assign to the File's .path
property, it causes the file to be moved or renamed to the value you assign.  Assigning to the .mode property
does a chmod() on the file.  And so on.

Deleting files is done via the Directory Proxy.

### Directories

A Directory is a Proxy that exposes a directory on disk as an Object to JavaScript.  Like a File, it exposes attributes
of the directory.  Unlike a File, the content property is an array of file/directory names contained in the Directory.

Additionally, if you access dir[filename], you will access a File Proxy for the specified filename in the directory.
Iterating a Directory Proxy via for (..in..) will iterate the Directory's attributes.  But you can test for existence
of a file in a directory using (filename in directory) syntax.

Here is a program to exercise Directory and File together:

```javascript
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
```

And here is the program's output:

```
mschwartz@dionysus:~/src/SilkJS-Harmony$ silkjs ./tests/test-filesystem.js
Directory Proxy Properties
 + path
 + name
 + content
 + stat
 + size
 + uid
 + gid
 + mode
 + mtime
 + atime
 + ctime
----------------------
LISTING OF CURRENT DIRECTORY
.git 14
.idea 11
lib 3
README.md 12391
test.txt 38
test2.txt 37
tests 4
----------------------
DUMP CURRENT DIRECTORY
key = path
.
key = name
.
key = content
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (array) :
 [0] : (string) .git
 [1] : (string) .idea
 [2] : (string) lib
 [3] : (string) README.md
 [4] : (string) test.txt
 [5] : (string) test2.txt
 [6] : (string) tests

key = stat
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (object) :
 [dev] : (number) 234881028
 [ino] : (number) 6860393
 [mode] : (number) 16877
 [nlink] : (number) 9
 [uid] : (number) 501
 [gid] : (number) 20
 [rdev] : (number) 0
 [size] : (number) 306
 [blksize] : (number) 4096
 [blocks] : (number) 0
 [atime] : (number) 1338138857
 [mtime] : (number) 1338138853
 [ctime] : (number) 1338138853

key = size
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 7

key = uid
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 501

key = gid
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 20

key = mode
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 16877

key = mtime
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 1338138853

key = atime
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 1338138857

key = ctime
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (number) 1338138853

----------------------
ATTRIBUTES OF EXISTING FILE test.txt
path = ./test.txt
name = test.txt
content = This is content
in the file
test.txt


stat = [object Object]
size = 38
uid = 501
gid = 20
mode = 33188
mtime = 1338135180
atime = 1338138857
ctime = 1338135180
----------------------
CREATE NEW FILE test
test exists? (should be false): false
test exists? (should be true): true
/Users/mschwartz/src/SilkJS-Harmony/lib/stdio.js line 54 (Proxy.create.set):
 (array) :
 [path] : (string) test
 [name] : (string) test
 [content] : (string) TEST
 [stat] : (object) :
   [dev] : (number) 234881028
   [ino] : (number) 7007660
   [mode] : (number) 33188
   [nlink] : (number) 1
   [uid] : (number) 501
   [gid] : (number) 20
   [rdev] : (number) 0
   [size] : (number) 4
   [blksize] : (number) 4096
   [blocks] : (number) 8
   [atime] : (number) 1338138857
   [mtime] : (number) 1338138857
   [ctime] : (number) 1338138857
 [size] : (number) 4
 [uid] : (number) 501
 [gid] : (number) 20
 [mode] : (number) 33188
 [mtime] : (number) 1338138857
 [atime] : (number) 1338138857
 [ctime] : (number) 1338138857

TEST
----------------------
TEST FILE COPY
This is content
in the file
test.txt


----------------------
DELETE FILE test
test exists? (should be true): true
test exists? (should be false): false
```




