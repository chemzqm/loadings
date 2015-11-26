# Loadings

Some canvas loadings like [jxnblk/loading](https://github.com/jxnblk/loading)

[chemzqm.github.io/loadings/](chemzqm.github.io/loadings/)

Why canvas?

* Better support for browsers [http://caniuse.com/#canvas](http://caniuse.com/#canvas)
* Better performance
* Control via javascript

## Usage

    npm i loadings

You can use one of them like `require('loadings/lib/three')`, some bundle tools like [webpack](webpack.github.io), would build only the parts you need.

## Example

``` js
var three = require('loadings/lib/three')
function $(id) {
  return document.getElementById(id)
}

var s = three(document.getElementById('three'))

// when you want to stop
s.stop()
```

## API

### .three(parentNode, [options])
### .bars(parentNode, [options])
### .wander(parentNode, [options])
### .spin(parentNode, [options])
### .spokes(parentNode, [options])
### .bubbles(parentNode, [options])

* `parentNode`       the parentNode for canvas render
* `options`          optional options
* `options.color`    the fill color for loading region
* `options.duration` anmation duration in milisecond
* `options.radius`   set the radius for animate region, works only with `spin` `bubbles` `spokes`

### loading.stop()

stop the animation