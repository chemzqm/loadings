var util = require('./util')

function Circle(ctx, x, y, r, sr, dir) {
  this.ctx = ctx
  this.r = r
  this.x = x
  this.y = y
  this.sr = sr
  this.dir = dir
}

Circle.prototype.draw = function (dis, min) {
  var r = util.limit(this.sr, this.r, this.dir, dis, min)
  var ctx = this.ctx
  if (r > 0) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, r, 0, 2*Math.PI)
    ctx.fill()
  }
}

module.exports = Circle
