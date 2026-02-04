// Polyfill for Object.hasOwn (not available in older Node.js versions used by Electron 11)
if (!Object.hasOwn) {
  Object.hasOwn = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }
}
