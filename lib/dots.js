var raf = require('raf')
var util = require('./util')
var Circle = require('./circle')

module.exports = function (node, opts) {
  opts = opts || []
  var ctx = util.createCtx(node)
  var h = node.clientHeight
  var w = node.clientWidth
  var r = (w/3 - 4)/2
  var circles = []
  var duration = opts.duration || 1500
  // 2*(1+1/3)
  var speed = (8/3)*r/duration
  var color = opts.color || '#ffffff'
  var rgb = util.torgb(color)
  ctx.fillStyle = 'rgba(' + rgb.r +', ' + rgb.g + ', ' + rgb.b+ ', 1)'
  var sr
  var dir
  for (var i = 0; i < 3; i++) {
    switch (i) {
      case 0:
        sr = r/3
        dir = -1
        break
      case 1:
        sr = r
        dir = -1
        break
      case 2:
        sr = r/3
        dir = 1
      break
    }
    var x = w/6 + i*(w/3)
    var circle = new Circle(ctx, x, h/2, r, sr, dir)
    circles.push(circle)
  }
  var start
  var stop = false
  function step(timestamp) {
    if (stop) return
    if (!node.parentNode) stop = true
    if (!start) start = timestamp
    var t = (timestamp - start)%duration
    var dis = t*speed
    ctx.clearRect(0,0, w, h)
    circles.forEach(function (circle) {
      circle.draw(dis, -r/3)
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
