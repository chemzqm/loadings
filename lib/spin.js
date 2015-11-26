var raf = require('raf')
var util = require('./util')

/**
 * `opts.color` hex color value to fill
 * `opts.duration` duration for animation
 *
 * @public
 * @param  {Element}  node
 * @param {Object} opts
 */
module.exports = function (node, opts) {
  opts = opts || []
  var ctx = util.createCtx(node)
  var h = node.clientHeight
  var w = node.clientWidth
  var duration = opts.duration || 1000
  // color
  var color = opts.color || '#ffffff'
  var rgb = util.torgb(color)
  var x = h/2
  var y = w/2
  var r = Math.min(h, w)/2 - 4
  var stop
  var start
  function step(timestamp) {
    if (stop) return
    if (!start) start = timestamp
    if (!node.parentNode) stop = true
    ctx.clearRect(0, 0, w, h)
    var ts = (timestamp - start)%duration
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(' + rgb.r +', ' + rgb.g + ', ' + rgb.b+ ', 0.4)'
    ctx.arc(x, y, r, 0, Math.PI*2)
    ctx.lineWidth = 8
    ctx.stroke()
    ctx.endP
    var a = -Math.PI/2 + Math.PI*2*ts/duration
    var e = a + Math.PI/2
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(' + rgb.r +', ' + rgb.g + ', ' + rgb.b+ ', 1)'
    ctx.arc(x, y, r, a, e)
    ctx.stroke()
    raf(step)
  }
  raf(step)
  return {
    stop: function () {
      stop = true
    }
  }
}

