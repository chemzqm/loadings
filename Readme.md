# Loadings

Some canvas loadings like [jxnblk/loading](https://github.com/jxnblk/loading)

[chemzqm.github.io/loadings/](https://chemzqm.github.io/loadings/)

Why canvas?

* Better support for browsers [http://caniuse.com/#canvas](http://caniuse.com/#canvas)
* Better performance
* Control via javascript

## Usage

    npm i loadings

You can use one of them like `require('loadings/lib/dots')`, some bundle tools like [webpack](webpack.github.io), would build only the parts you need.

## Example

``` js
var dots = require('loadings/lib/dots')
function $(id) {
  return document.getElementById(id)
}

var s = dots(document.getElementById('dots'))

// when you want to stop
s.stop()
```

## API

#### .dots(parentNode, [options])
#### .bars(parentNode, [options])
#### .wander(parentNode, [options])
#### .spin(parentNode, [options])
#### .spokes(parentNode, [options])
#### .bubbles(parentNode, [options])

* `parentNode`       the parentNode for canvas render
* `options`          optional options
* `options.color`    the fill color for loading region
* `options.duration` anmation duration in milisecond
* `options.radius`   set the radius for animate region, works only with `spin` `bubbles` `spokes`

#### loading.stop()

stop the animation

## License

MIT

Copyright © 2015 chemzqm@gmai.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

