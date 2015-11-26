var loading = require('..')
var throttle = require('throttleit')
var scrollTo = require('scroll-to');

function $(id) {
  return document.getElementById(id)
}

loading.three($('three'))
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
  var lis = [].slice.call(document.querySelectorAll('#dots li'))
  lis.forEach(function (li) {
    li.classList.remove('active')
  })
  document.querySelector('#dots li:nth-child(' + n + ')').classList.add('active')
}
