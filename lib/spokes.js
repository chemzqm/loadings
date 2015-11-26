var raf = require('raf')
var util = require('./util')

/**
 * `opts.color` hex color value to fill
 * `opts.duration` duration for animation
 * `opts.radius` redius for the animation region
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
  var ar = opts.radius || w/2
  ctx.translate(h/2, w/2)
  ctx.save()
  var rects = []
  var duration = opts.duration || 1500
  var color = opts.color || '#ffffff'
  var rgb = util.torgb(color)
  ctx.fillStyle = 'rgba(' + rgb.r +', ' + rgb.g + ', ' + rgb.b+ ', 1)'
  var alpha = 1
  var angle = 0
  var rh = 2*(Math.tan(Math.PI/8)*ar/2 - 3)
  for(var i = 0; i < 8; i++) {
    var rect = new Rect(ctx, rh, ar/2, ar/2, -rh/2, angle, alpha, rgb)
    rects.push(rect)
    angle = angle - Math.PI/4
    alpha = 1 - i/7
  }
  var start
  var stop = false
  function step(timestamp) {
    if (stop) return
    if (!start) start = timestamp
    if (!node.parentNode) stop = true
    var d = (timestamp - start)%duration
    var percent = d/duration
    ctx.clearRect(-w/2,-h/2, w, h)
    rects.forEach(function (rect) {
      rect.draw(percent)
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

function Rect(ctx, h, w, x, y, a, alpha, rgb) {
  this.ctx = ctx
  this.h = h
  this.w = w
  this.x = x
  this.y = y
  this.a = a
  this.alpha = alpha
  this.rgb = rgb
}

Rect.prototype.getAlpha = function (percent) {
  var alpha = this.alpha - percent
  if (alpha < 0) alpha = alpha + 1
  return alpha
}

Rect.prototype.draw = function (percent) {
  var rgb = this.rgb
  var alpha = this.getAlpha(percent)
  var fill = 'rgba(' + rgb.r +', ' + rgb.g + ', ' + rgb.b+ ', ' + alpha + ')'
  var ctx = this.ctx
  ctx.save()
  ctx.rotate(this.a)
  ctx.fillStyle = fill
  ctx.fillRect(this.x, this.y, this.w, this.h)
  ctx.restore()
}
