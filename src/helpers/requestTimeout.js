const requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(/* function */ callback /* , DOMElement */) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

const requestTimeout = function(fn, delay) {
  if (
    !window.requestAnimationFrame &&
    !window.webkitRequestAnimationFrame &&
    !(
      window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame
    ) && // Firefox 5 ships without cancel support
    !window.oRequestAnimationFrame &&
    !window.msRequestAnimationFrame
  ) {
    return window.setTimeout(fn, delay);
  }

  var start = new Date().getTime();
  var handle = {};

  function loop() {
    var current = new Date().getTime();
    var delta = current - start;

    delta >= delay ? fn.call() : (handle.value = requestAnimFrame(loop));
  }

  handle.value = requestAnimFrame(loop);
  return handle;
};

/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
const clearRequestTimeout = function(handle) {
  window.cancelAnimationFrame
    ? window.cancelAnimationFrame(handle.value)
    : window.webkitCancelAnimationFrame
      ? window.webkitCancelAnimationFrame(handle.value)
      : window.webkitCancelRequestAnimationFrame
        ? window.webkitCancelRequestAnimationFrame(
            handle.value,
          ) /* Support for legacy API */
        : window.mozCancelRequestAnimationFrame
          ? window.mozCancelRequestAnimationFrame(handle.value)
          : window.oCancelRequestAnimationFrame
            ? window.oCancelRequestAnimationFrame(handle.value)
            : window.msCancelRequestAnimationFrame
              ? window.msCancelRequestAnimationFrame(handle.value)
              : clearTimeout(handle);
};

export { requestAnimFrame, requestTimeout, clearRequestTimeout }
