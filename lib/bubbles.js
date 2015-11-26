var raf = require('raf')
var util = require('./util')
var Circle = require('./circle')

/**
 * `opts.color` hex color value to fill
 * `opts.duration` duration for animation
 * `opts.radius` radius for the animate region
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
  var a = Math.PI/8
  var ar = opts.radius || w/2
  var r = ((ar)*Math.sin(a) - 3)/(1 + Math.sin(a))
  var dr = ar - r
  var circles = []
  var duration = opts.duration || 1500
  var speed = 4*r/duration
  var color = opts.color || '#ffffff'
  var rgb = util.torgb(color)
  ctx.fillStyle = 'rgba(' + rgb.r +', ' + rgb.g + ', ' + rgb.b+ ', 1)'
  var sr = 0
  var dir = 1
  var angle = 0
  for(var i = 0; i < 8; i++) {
    var x = dr*Math.cos(angle)
    var y = dr*Math.sin(angle)
    var circle = new Circle(ctx, x + w/2, y + h/2, r, sr, dir)
    circles.push(circle)
    angle = angle - Math.PI/4
    sr = sr + dir*r/2
    if (sr >= r) {
      sr = r - (sr -r)
      dir = -1
    } else if (sr <= -r) {
      sr = -r + (-r - sr)
      dir = 1
    }
  }
  var start
  var stop = false
  function step(timestamp) {
    if (stop) return
    if (!start) start = timestamp
    if (!node.parentNode) stop = true
    var t = (timestamp - start)%duration
    var dis = t*speed
    ctx.clearRect(0,0, w, h)
    circles.forEach(function (circle) {
      circle.draw(dis)
    })
    raf(step)
  }
  raf(step)
  return {
    stop: function () {
      stop = true
    }
  }
}
