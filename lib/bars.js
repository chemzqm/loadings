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
  var duration = opts.duration || 1500
  var color = opts.color || '#ffffff'
  var rgb = util.torgb(color)
  ctx.fillStyle = 'rgba(' + rgb.r +', ' + rgb.g + ', ' + rgb.b+ ', 1)'
  var cy = h/2
  var cx
  var bh
  var bw = w/6 - 4
  var maxh = h - 20
  var minh = h/4
  for(var i = 0; i < 5; i++) {
    cx = (i + 1)*w/6
    bh = maxh - i*maxh/4
    var bar = new Bar(ctx, cx, cy, bw, bh, minh, maxh, duration)
    bars.push(bar)
  }
  var start
  var stop = false
  function step(timestamp) {
    if (stop) return
    if (!start) start = timestamp
    if (!node.parentNode) stop = true
    var ts = (timestamp - start)%duration
    var dis = ts*(2*maxh/duration)
    ctx.clearRect(0, 0, w, h)
    bars.forEach(function (bar) {
      bar.draw(dis)
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

function Bar(ctx, cx, cy, w, h, minh, maxh) {
  this.ctx = ctx
  this.cx = cx
  this.cy = cy
  this.w = w
  this.h = h
  this.minh = minh
  this.maxh = maxh
}

Bar.prototype.getHeight = function (dis) {
  var h
  var mh = this.maxh
  if (this.h >= mh) {
    h = this.h - dis
    if (h < 0) h = - h
    if (h >= mh) h = mh - (h - mh)
  } else {
    h = this.h + dis
    if (h >= mh) h = mh - (h - mh)
    if (h < 0) h = - h
  }
  return h
}

Bar.prototype.draw = function (dis) {
  var h = this.getHeight(dis)
  h = Math.max(this.minh, h)
  var x = this.cx - this.w/2
  var y = this.cy - h/2
  var ctx = this.ctx
  ctx.fillRect(x, y, this.w, h)
}
