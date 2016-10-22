var assert = require('assert');


var isUndefined = eval('function a(){}');
assert(isUndefined === undefined);

var isFunction = eval('(function a(){})');
assert(typeof isFunction === 'function');

assert('bound'.replace(/\s|bound(?!$)/g, '') === 'bound');
assert('boundde'.replace(/\s|bound(?!$)/g, '') === 'de');
assert('boundde bound2'.replace(/\s|bound(?!$)/g, '') === 'de2');
assert('name'.replace(/\s|bound(?!$)/g, '') === 'name');
assert(''.replace(/\s|bound(?!$)/g, '') === '');

var thenify = require('./');

// ========== 转换后是否带有回调的异同 ===========
function test(req, res, cb){
    console.log('do sth: has callback', req, res);
    cb(null, 'value');
}

// test函数转换后执行时不带回调
var testAsync1 = thenify(test);
var fn1 = testAsync1('req', 'res');
assert(fn1 instanceof Promise, 'should be an instanceof Promise');

// test函数转换后执行时带有回调
var testAsync2 = thenify.withCallback(test);
var fn2 = testAsync2('req', 'res', (err, value) => console.log('has cb', err, value));
assert(fn2 instanceof Promise !== true, 'should not be an instanceof Promise');
