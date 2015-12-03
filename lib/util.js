var autoscale = require('autoscale-canvas')

/**
 * limit a value in -r r
 *
 * @param  {Number}  s start value
 * @param  {Number}  r range
 * @param  {Number}  dir direction 1 or -1 for up and down
 * @param  {Number}  d distance moved
 * @return {Number}
 * @public
 */
exports.limit = function (s, r, dir, d, min) {
  var circle = 4*r
  if (d > circle) d = d%circle
  min = min == null ? -r : min
  var res = s + dir*d
  if (res < min) {
    res = min + (min - res)
    if (res > r) res = r - (res - r)
  } else if (res > r) {
    res = r - (res - r)
    if (res < min) res = min + (min - res)
  }
  return res
}

exports.createCtx = function (node) {
  var canvas = this.canvas  = document.createElement('canvas')
  node.appendChild(canvas)
  var rect = node.getBoundingClientRect()
  canvas.height = rect.height
  canvas.width = rect.width
  var ctx = canvas.getContext('2d')
  autoscale(canvas)
  return ctx
}

exports.torgb = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}
