
var Promise = require('any-promise')
var assert = require('assert')

module.exports = thenify

/**
 * Turn async functions into promises
 *
 * @param {Function} $$__fn__$$
 * @return {Function}
 * @api public
 */
// 将函数function a(p1, p2, cb)转换成a(p1, p2).then
function thenify($$__fn__$$) {
  assert(typeof $$__fn__$$ === 'function')
  // for test
  var fn = createWrapper($$__fn__$$.name);
  return eval(fn)
}

/**
 * Turn async functions into promises and backward compatible with callback
 *
 * @param {Function} $$__fn__$$
 * @return {Function}
 * @api public
 */
// 函数function a(p1, p2, cb) 转换成 aAsync(p1, p2, [cb2])
// 后, 如果仍然有cb2存在则直接返回执行原来的a函数
// 否则转换成Promise执行a(p1, p2).then
thenify.withCallback = function ($$__fn__$$) {
  assert(typeof $$__fn__$$ === 'function')
  return eval(createWrapper($$__fn__$$.name, true))
}

function createCallback(resolve, reject) {
  return function(err, value) {
    if (err) return reject(err)
    var length = arguments.length
    if (length <= 2) return resolve(value)
    var values = new Array(length - 1)
    for (var i = 1; i < length; ++i) values[i - 1] = arguments[i]
    resolve(values)
  }
}

function createWrapper(name, withCallback) {
  name = (name || '').replace(/\s|bound(?!$)/g, '')
  // 如果带有callback则还是直接执行该函数
  withCallback = withCallback ?
    'var lastType = typeof arguments[len - 1]\n'
    + 'console.log("lastType", lastType);'
    + 'if (lastType === "function") return $$__fn__$$.apply(self, arguments)\n'
   : ''

  return '(function ' + name + '() {\n'
    + 'var self = this\n'
    + 'var len = arguments.length\n'
    + withCallback
    + 'var args = new Array(len + 1)\n'
    + 'for (var i = 0; i < len; ++i) args[i] = arguments[i]\n'
    + 'var lastIndex = i\n'
    + 'return new Promise(function (resolve, reject) {\n'
      + 'args[lastIndex] = createCallback(resolve, reject)\n'
      + '$$__fn__$$.apply(self, args)\n'
    + '})\n'
  + '})'
}
