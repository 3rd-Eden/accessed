/**
 * Introduces a custom toJSON property that will only include properties that
 * have been previously accessed.
 *
 * @param {object} obj The object that needs to be tracked.
 * @param {object} options Additional configuration.
 * @returns {proxy} Wrapped object to track property access.
 * @public
 */
function accessed(obj, options = {}) {
  const keys = (options.keys || []).slice(0);
  const exclude = !!options.exclude;

  /**
   * Returns the JSON object based on property accessed.
   *
   * @returns {object} The cleaned object.
   * @private
   */
  function toJSON() {
    let shipit = keys;

    //
    // When the exclude mode is set we want to exclude the keys that have been
    // accessed so we only output which keys are not accessed.
    //
    if (exclude) {
      shipit = Object.keys(obj).filter(key => !~keys.indexOf(key)).concat(options.keys);
    }

    return shipit.reduce(function assemble(memo, key) {
      if (key in obj) memo[key] = obj[key];
      return memo;
    }, {});
  }

  return new Proxy(obj, {
    get: function tracker(target, prop) {
      //
      // Prevents the need to assigning a custom toJSON property on our object.
      // Also prevents additional filtering to prevent toJSON from appearing in
      // our keys array.
      //
      if ('toJSON' === prop) return toJSON;

      if (prop in target && !~keys.indexOf(prop)) {
        keys.push(prop);
      }

      return target[prop];
    }
  });
}

//
// Expose. All. The. Functions.
//
module.exports = accessed;
