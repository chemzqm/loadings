/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var loading = __webpack_require__(1)
	var throttle = __webpack_require__(12)
	var scrollTo = __webpack_require__(13);
	
	function $(id) {
	  return document.getElementById(id)
	}
	
	loading.dots($('dots'))
	loading.bubbles($('bubbles'), {
	  radius: 30
	})
	loading.spokes($('spokes'), {
	  radius: 25
	})
	loading.bars($('bars'))
	loading.wander($('wander'), {
	  color: '#EC1F00'
	})
	loading.spin($('spin'))
	
	var tween = false
	var top = document.body.scrollTop
	window.addEventListener('scroll', throttle(function (e) {
	  activeItem()
	  e.preventDefault()
	  if (tween) {
	    return
	  }
	  var dir = document.body.scrollTop > top ? 1 : 0
	  top = document.body.scrollTop
	  var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
	  if (top%vh < 10 || (top + 10)%vh < 10) return
	  var to = Math.floor(top/vh) + dir
	  to = Math.min(to, 5)
	  to = Math.max(to, 0)
	  var d = Math.abs(to*vh - top)
	  tween = scrollTo(0, to*vh, {
	    ease: 'out-quad',
	    duration: d*1000/vh
	  })
	  tween.on('end', function () {
	    setTimeout(function () {
	      tween = false
	    }, 100)
	  })
	}, 100), false)
	
	function preventDefault(e) {
	  if (tween) {
	    e = e || window.event
	    if (e.preventDefault)
	        e.preventDefault()
	    e.returnValue = false
	  }
	}
	
	window.onwheel = preventDefault; // modern standard
	window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	window.ontouchmove  = preventDefault;
	
	function activeItem() {
	  var top = document.body.scrollTop
	  var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
	  var n = Math.round(top/vh) + 1
	  var lis = [].slice.call(document.querySelectorAll('#indicator li'))
	  lis.forEach(function (li) {
	    li.classList.remove('active')
	  })
	  document.querySelector('#indicator li:nth-child(' + n + ')').classList.add('active')
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	exports.dots = __webpack_require__(2)
	exports.bubbles = __webpack_require__(7)
	exports.spokes = __webpack_require__(8)
	exports.bars = __webpack_require__(9)
	exports.wander = __webpack_require__(10)
	exports.spin = __webpack_require__(11)
	
	
	


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var raf = __webpack_require__(3)
	var util = __webpack_require__(4)
	var Circle = __webpack_require__(6)
	
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Expose `requestAnimationFrame()`.
	 */
	
	exports = module.exports = window.requestAnimationFrame
	  || window.webkitRequestAnimationFrame
	  || window.mozRequestAnimationFrame
	  || fallback;
	
	/**
	 * Fallback implementation.
	 */
	
	var prev = new Date().getTime();
	function fallback(fn) {
	  var curr = new Date().getTime();
	  var ms = Math.max(0, 16 - (curr - prev));
	  var req = setTimeout(fn, ms);
	  prev = curr;
	  return req;
	}
	
	/**
	 * Cancel.
	 */
	
	var cancel = window.cancelAnimationFrame
	  || window.webkitCancelAnimationFrame
	  || window.mozCancelAnimationFrame
	  || window.clearTimeout;
	
	exports.cancel = function(id){
	  cancel.call(window, id);
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var autoscale = __webpack_require__(5)
	
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


/***/ },
/* 5 */
/***/ function(module, exports) {

	
	/**
	 * Retina-enable the given `canvas`.
	 *
	 * @param {Canvas} canvas
	 * @return {Canvas}
	 * @api public
	 */
	
	module.exports = function(canvas){
	  var ctx = canvas.getContext('2d');
	  var ratio = window.devicePixelRatio || 1;
	  if (1 != ratio) {
	    canvas.style.width = canvas.width + 'px';
	    canvas.style.height = canvas.height + 'px';
	    canvas.width *= ratio;
	    canvas.height *= ratio;
	    ctx.scale(ratio, ratio);
	  }
	  return canvas;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(4)
	
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var raf = __webpack_require__(3)
	var util = __webpack_require__(4)
	var Circle = __webpack_require__(6)
	
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var raf = __webpack_require__(3)
	var util = __webpack_require__(4)
	
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
	  var color = opts.color || '#000000'
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


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var raf = __webpack_require__(3)
	var util = __webpack_require__(4)
	
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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var raf = __webpack_require__(3)
	var util = __webpack_require__(4)
	
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


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var raf = __webpack_require__(3)
	var util = __webpack_require__(4)
	
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
	


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = throttle;
	
	/**
	 * Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
	 *
	 * @param {Function} func Function to wrap.
	 * @param {Number} wait Number of milliseconds that must elapse between `func` invocations.
	 * @return {Function} A new function that wraps the `func` function passed in.
	 */
	
	function throttle (func, wait) {
	  var ctx, args, rtn, timeoutID; // caching
	  var last = 0;
	
	  return function throttled () {
	    ctx = this;
	    args = arguments;
	    var delta = new Date() - last;
	    if (!timeoutID)
	      if (delta >= wait) call();
	      else timeoutID = setTimeout(call, wait - delta);
	    return rtn;
	  };
	
	  function call () {
	    timeoutID = 0;
	    last = +new Date();
	    rtn = func.apply(ctx, args);
	    ctx = null;
	    args = null;
	  }
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var Tween = __webpack_require__(14);
	var raf = __webpack_require__(3);
	
	/**
	 * Expose `scrollTo`.
	 */
	
	module.exports = scrollTo;
	
	/**
	 * Scroll to `(x, y)`.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @api public
	 */
	
	function scrollTo(x, y, options) {
	  options = options || {};
	
	  // start position
	  var start = scroll();
	
	  // setup tween
	  var tween = Tween(start)
	    .ease(options.ease || 'out-circ')
	    .to({ top: y, left: x })
	    .duration(options.duration || 1000);
	
	  // scroll
	  tween.update(function(o){
	    window.scrollTo(o.left | 0, o.top | 0);
	  });
	
	  // handle end
	  tween.on('end', function(){
	    animate = function(){};
	  });
	
	  // animate
	  function animate() {
	    raf(animate);
	    tween.update();
	  }
	
	  animate();
	  
	  return tween;
	}
	
	/**
	 * Return scroll position.
	 *
	 * @return {Object}
	 * @api private
	 */
	
	function scroll() {
	  var y = window.pageYOffset || document.documentElement.scrollTop;
	  var x = window.pageXOffset || document.documentElement.scrollLeft;
	  return { top: y, left: x };
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */
	
	var Emitter = __webpack_require__(15);
	var clone = __webpack_require__(16);
	var type = __webpack_require__(17);
	var ease = __webpack_require__(18);
	
	/**
	 * Expose `Tween`.
	 */
	
	module.exports = Tween;
	
	/**
	 * Initialize a new `Tween` with `obj`.
	 *
	 * @param {Object|Array} obj
	 * @api public
	 */
	
	function Tween(obj) {
	  if (!(this instanceof Tween)) return new Tween(obj);
	  this._from = obj;
	  this.ease('linear');
	  this.duration(500);
	}
	
	/**
	 * Mixin emitter.
	 */
	
	Emitter(Tween.prototype);
	
	/**
	 * Reset the tween.
	 *
	 * @api public
	 */
	
	Tween.prototype.reset = function(){
	  this.isArray = 'array' === type(this._from);
	  this._curr = clone(this._from);
	  this._done = false;
	  this._start = Date.now();
	  return this;
	};
	
	/**
	 * Tween to `obj` and reset internal state.
	 *
	 *    tween.to({ x: 50, y: 100 })
	 *
	 * @param {Object|Array} obj
	 * @return {Tween} self
	 * @api public
	 */
	
	Tween.prototype.to = function(obj){
	  this.reset();
	  this._to = obj;
	  return this;
	};
	
	/**
	 * Set duration to `ms` [500].
	 *
	 * @param {Number} ms
	 * @return {Tween} self
	 * @api public
	 */
	
	Tween.prototype.duration = function(ms){
	  this._duration = ms;
	  return this;
	};
	
	/**
	 * Set easing function to `fn`.
	 *
	 *    tween.ease('in-out-sine')
	 *
	 * @param {String|Function} fn
	 * @return {Tween}
	 * @api public
	 */
	
	Tween.prototype.ease = function(fn){
	  fn = 'function' == typeof fn ? fn : ease[fn];
	  if (!fn) throw new TypeError('invalid easing function');
	  this._ease = fn;
	  return this;
	};
	
	/**
	 * Stop the tween and immediately emit "stop" and "end".
	 *
	 * @return {Tween}
	 * @api public
	 */
	
	Tween.prototype.stop = function(){
	  this.stopped = true;
	  this._done = true;
	  this.emit('stop');
	  this.emit('end');
	  return this;
	};
	
	/**
	 * Perform a step.
	 *
	 * @return {Tween} self
	 * @api private
	 */
	
	Tween.prototype.step = function(){
	  if (this._done) return;
	
	  // duration
	  var duration = this._duration;
	  var now = Date.now();
	  var delta = now - this._start;
	  var done = delta >= duration;
	
	  // complete
	  if (done) {
	    this._from = this._to;
	    this._update(this._to);
	    this._done = true;
	    this.emit('end');
	    return this;
	  }
	
	  // tween
	  var from = this._from;
	  var to = this._to;
	  var curr = this._curr;
	  var fn = this._ease;
	  var p = (now - this._start) / duration;
	  var n = fn(p);
	
	  // array
	  if (this.isArray) {
	    for (var i = 0; i < from.length; ++i) {
	      curr[i] = from[i] + (to[i] - from[i]) * n;
	    }
	
	    this._update(curr);
	    return this;
	  }
	
	  // objech
	  for (var k in from) {
	    curr[k] = from[k] + (to[k] - from[k]) * n;
	  }
	
	  this._update(curr);
	  return this;
	};
	
	/**
	 * Set update function to `fn` or
	 * when no argument is given this performs
	 * a "step".
	 *
	 * @param {Function} fn
	 * @return {Tween} self
	 * @api public
	 */
	
	Tween.prototype.update = function(fn){
	  if (0 == arguments.length) return this.step();
	  this._update = fn;
	  return this;
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */
	
	module.exports = Emitter;
	
	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */
	
	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};
	
	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};
	
	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }
	
	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};
	
	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	
	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }
	
	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;
	
	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }
	
	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};
	
	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */
	
	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];
	
	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */
	
	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};
	
	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */
	
	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var type;
	try {
	  type = __webpack_require__(17);
	} catch (_) {
	  type = __webpack_require__(17);
	}
	
	/**
	 * Module exports.
	 */
	
	module.exports = clone;
	
	/**
	 * Clones objects.
	 *
	 * @param {Mixed} any object
	 * @api public
	 */
	
	function clone(obj){
	  switch (type(obj)) {
	    case 'object':
	      var copy = {};
	      for (var key in obj) {
	        if (obj.hasOwnProperty(key)) {
	          copy[key] = clone(obj[key]);
	        }
	      }
	      return copy;
	
	    case 'array':
	      var copy = new Array(obj.length);
	      for (var i = 0, l = obj.length; i < l; i++) {
	        copy[i] = clone(obj[i]);
	      }
	      return copy;
	
	    case 'regexp':
	      // from millermedeiros/amd-utils - MIT
	      var flags = '';
	      flags += obj.multiline ? 'm' : '';
	      flags += obj.global ? 'g' : '';
	      flags += obj.ignoreCase ? 'i' : '';
	      return new RegExp(obj.source, flags);
	
	    case 'date':
	      return new Date(obj.getTime());
	
	    default: // string, number, boolean, …
	      return obj;
	  }
	}


/***/ },
/* 17 */
/***/ function(module, exports) {

	/**
	 * toString ref.
	 */
	
	var toString = Object.prototype.toString;
	
	/**
	 * Return the type of `val`.
	 *
	 * @param {Mixed} val
	 * @return {String}
	 * @api public
	 */
	
	module.exports = function(val){
	  switch (toString.call(val)) {
	    case '[object Date]': return 'date';
	    case '[object RegExp]': return 'regexp';
	    case '[object Arguments]': return 'arguments';
	    case '[object Array]': return 'array';
	    case '[object Error]': return 'error';
	  }
	
	  if (val === null) return 'null';
	  if (val === undefined) return 'undefined';
	  if (val !== val) return 'nan';
	  if (val && val.nodeType === 1) return 'element';
	
	  val = val.valueOf
	    ? val.valueOf()
	    : Object.prototype.valueOf.apply(val)
	
	  return typeof val;
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	
	// easing functions from "Tween.js"
	
	exports.linear = function(n){
	  return n;
	};
	
	exports.inQuad = function(n){
	  return n * n;
	};
	
	exports.outQuad = function(n){
	  return n * (2 - n);
	};
	
	exports.inOutQuad = function(n){
	  n *= 2;
	  if (n < 1) return 0.5 * n * n;
	  return - 0.5 * (--n * (n - 2) - 1);
	};
	
	exports.inCube = function(n){
	  return n * n * n;
	};
	
	exports.outCube = function(n){
	  return --n * n * n + 1;
	};
	
	exports.inOutCube = function(n){
	  n *= 2;
	  if (n < 1) return 0.5 * n * n * n;
	  return 0.5 * ((n -= 2 ) * n * n + 2);
	};
	
	exports.inQuart = function(n){
	  return n * n * n * n;
	};
	
	exports.outQuart = function(n){
	  return 1 - (--n * n * n * n);
	};
	
	exports.inOutQuart = function(n){
	  n *= 2;
	  if (n < 1) return 0.5 * n * n * n * n;
	  return -0.5 * ((n -= 2) * n * n * n - 2);
	};
	
	exports.inQuint = function(n){
	  return n * n * n * n * n;
	}
	
	exports.outQuint = function(n){
	  return --n * n * n * n * n + 1;
	}
	
	exports.inOutQuint = function(n){
	  n *= 2;
	  if (n < 1) return 0.5 * n * n * n * n * n;
	  return 0.5 * ((n -= 2) * n * n * n * n + 2);
	};
	
	exports.inSine = function(n){
	  return 1 - Math.cos(n * Math.PI / 2 );
	};
	
	exports.outSine = function(n){
	  return Math.sin(n * Math.PI / 2);
	};
	
	exports.inOutSine = function(n){
	  return .5 * (1 - Math.cos(Math.PI * n));
	};
	
	exports.inExpo = function(n){
	  return 0 == n ? 0 : Math.pow(1024, n - 1);
	};
	
	exports.outExpo = function(n){
	  return 1 == n ? n : 1 - Math.pow(2, -10 * n);
	};
	
	exports.inOutExpo = function(n){
	  if (0 == n) return 0;
	  if (1 == n) return 1;
	  if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1);
	  return .5 * (-Math.pow(2, -10 * (n - 1)) + 2);
	};
	
	exports.inCirc = function(n){
	  return 1 - Math.sqrt(1 - n * n);
	};
	
	exports.outCirc = function(n){
	  return Math.sqrt(1 - (--n * n));
	};
	
	exports.inOutCirc = function(n){
	  n *= 2
	  if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1);
	  return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
	};
	
	exports.inBack = function(n){
	  var s = 1.70158;
	  return n * n * (( s + 1 ) * n - s);
	};
	
	exports.outBack = function(n){
	  var s = 1.70158;
	  return --n * n * ((s + 1) * n + s) + 1;
	};
	
	exports.inOutBack = function(n){
	  var s = 1.70158 * 1.525;
	  if ( ( n *= 2 ) < 1 ) return 0.5 * ( n * n * ( ( s + 1 ) * n - s ) );
	  return 0.5 * ( ( n -= 2 ) * n * ( ( s + 1 ) * n + s ) + 2 );
	};
	
	exports.inBounce = function(n){
	  return 1 - exports.outBounce(1 - n);
	};
	
	exports.outBounce = function(n){
	  if ( n < ( 1 / 2.75 ) ) {
	    return 7.5625 * n * n;
	  } else if ( n < ( 2 / 2.75 ) ) {
	    return 7.5625 * ( n -= ( 1.5 / 2.75 ) ) * n + 0.75;
	  } else if ( n < ( 2.5 / 2.75 ) ) {
	    return 7.5625 * ( n -= ( 2.25 / 2.75 ) ) * n + 0.9375;
	  } else {
	    return 7.5625 * ( n -= ( 2.625 / 2.75 ) ) * n + 0.984375;
	  }
	};
	
	exports.inOutBounce = function(n){
	  if (n < .5) return exports.inBounce(n * 2) * .5;
	  return exports.outBounce(n * 2 - 1) * .5 + .5;
	};
	
	// aliases
	
	exports['in-quad'] = exports.inQuad;
	exports['out-quad'] = exports.outQuad;
	exports['in-out-quad'] = exports.inOutQuad;
	exports['in-cube'] = exports.inCube;
	exports['out-cube'] = exports.outCube;
	exports['in-out-cube'] = exports.inOutCube;
	exports['in-quart'] = exports.inQuart;
	exports['out-quart'] = exports.outQuart;
	exports['in-out-quart'] = exports.inOutQuart;
	exports['in-quint'] = exports.inQuint;
	exports['out-quint'] = exports.outQuint;
	exports['in-out-quint'] = exports.inOutQuint;
	exports['in-sine'] = exports.inSine;
	exports['out-sine'] = exports.outSine;
	exports['in-out-sine'] = exports.inOutSine;
	exports['in-expo'] = exports.inExpo;
	exports['out-expo'] = exports.outExpo;
	exports['in-out-expo'] = exports.inOutExpo;
	exports['in-circ'] = exports.inCirc;
	exports['out-circ'] = exports.outCirc;
	exports['in-out-circ'] = exports.inOutCirc;
	exports['in-back'] = exports.inBack;
	exports['out-back'] = exports.outBack;
	exports['in-out-back'] = exports.inOutBack;
	exports['in-bounce'] = exports.inBounce;
	exports['out-bounce'] = exports.outBounce;
	exports['in-out-bounce'] = exports.inOutBounce;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map