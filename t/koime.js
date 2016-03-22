'use strict'
var test   = require('tape')
var stream = require('readable-stream')
var koime  = require('../')
var action = require('../action')
var store  = require('../store')

function push (readable) {
    return stream.Readable.prototype.push.apply(readable, [null])
}

test('koime(actions)(stores)((err) => {...})', (t) => {
    var taps = {
        _: []
      , count:  function () { return this._.length }
      , amount: function () { return this._.reduce((a, b) => {return a + b}, 0) }
      , put:    function (n) { return (this._ = this._.concat(n)) }
    }
    var actTap        = action('Tap', null, {tap: actCraeteTap})
    var storeTap      = store( 'Tap', {taps: taps}, {amount: storeAmountTap})
    var actTapCount   = action('Tap.Count', null, {count: actCountTap})
    var storeTapCount = store( 'Tap.Count', {taps: taps}, {count: storeCountTap})

    var spy  = []
    var errs = []

    storeTap.on('data', (data) => {
        spy.push(data)
    })

    storeTapCount.once('data', (count) => {
        t.is(errs.length, 2, 'callback onError catch error 2 times')
        t.is(errs[0].message, 'actTap Error',   'errs[0].message === "actTap Error"')
        t.is(errs[1].message, 'storeTap Error', 'errs[1].message === "storeTap Error"')
        t.is(spy.length,  3, 'storeTap push data 3 times')
        t.ok(spy[0] > 0, 'spy[0] > 0')
        t.ok(spy[1] > spy[0], 'spy[1] (' + spy[1] + ') > spy[0] (' + spy[0] + ')')
        t.ok(spy[2] > spy[1], 'spy[2] (' + spy[2] + ') > spy[1] (' + spy[1] + ')')
        t.is(count, 3)
        t.end()
    })

    koime(actTap, actTapCount)(storeTap, storeTapCount)((err) => {errs.push(err)})

    actTap.tap()
    actTap.emit('error', new Error('actTap Error'))
    actTap.tap()
    storeTap.emit('error', new Error('storeTap Error'))
    actTap.tap()
    actTapCount.count()

    function actCraeteTap () {
        this.push('amount', parseInt(Math.random() * 10, 10) || 1)
    }
    function storeAmountTap (num, done) {
        this.opt.taps.put(num)
        done(null, this.opt.taps.amount())
    }

    function actCountTap () {
        this.push('count', true)
    }
    function storeCountTap (flg, done) {
         done(null, this.opt.taps.count())
    }
})
