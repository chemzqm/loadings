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
  var bars = []
  var duration = opts.duration || 2000
  // color
  var color = opts.color || '#ffffff'
  var rgb = util.torgb(color)
  ctx.fillStyle = 'rgba(' + rgb.r +', ' + rgb.g + ', ' + rgb.b+ ', 1)'
  var bh = Math.max(8, h/8)
  var cw = w/3
  var cy = 0
  var alpha
  for(var i = 0; i < 3; i++) {
    var cx = 0
    alpha = 1 - (2 - i)*0.4
    var fill = 'rgba(' + rgb.r +', ' + rgb.g + ', ' + rgb.b+ ', ' + alpha + ')'
    var speed = (2*w - 2*cw)/duration
    var mx = w - cw
    var bar = new Bar(ctx, cx, cy, cw, bh, fill, mx, speed, duration)
    cw = cw - w/10
    bars.push(bar)
  }
  var start
  var stop = false
  function step(timestamp) {
    if (stop) return
    if (!start) start = timestamp
    if (!node.parentNode) stop = true
    var ts = (timestamp - start)%duration
    ctx.clearRect(0, 0, w, h)
    bars.forEach(function (bar) {
      bar.draw(ts)
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

function Bar(ctx, x, y, w, h, fill, mx, speed, duration) {
  this.ctx = ctx
  this.x = x
  this.y = y
  this.w = w
  this.h = h
  this.fill = fill
  this.mx = mx
  this.speed = speed
  this.duration = duration
}

Bar.prototype.getX = function (ts) {
  var dur = this.duration
  //console.log(dur - ts > 0)
  var d
  if (ts < dur/2) {
    d = ts*this.speed*inOutSine(2*ts/dur)
  } else {
    ts = ts - dur/2
    d = this.mx + ts*this.speed*inOutSine(2*ts/dur)
  }
  //var d = ts*this.speed
  var x = this.x + d
  var mx = this.mx
  if (x > mx) {
    x = mx - (x - mx)
    if (x < 0) x = -x
  }
  return x
}

Bar.prototype.draw = function (ts) {
  var ctx = this.ctx
  var x = this.getX(ts)
  ctx.fillStyle = this.fill
  ctx.fillRect(x, this.y, this.w, this.h)
}

function inOutSine(n){
  return .5 * (1 - Math.cos(Math.PI * n));
}
