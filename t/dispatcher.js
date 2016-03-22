'use strict'
var test = require('tape')
var Dispatcher = require('../_dispatcher')

test('var dispatcher = new Dispatcher', (t) => {
    var dispatcher = Dispatcher()
    dispatcher.once('data', (payload) => {
        t.ok(payload, 'dispatcher.on("data", (payload) => {})')
        t.deepEqual(payload, {label: 'foo', method: 'getValue', value: 'FOO'}
          , "payload deepEqual {label: 'foo', method: 'getValue', value: 'FOO'}")
        t.end()
    })

    console.log('# dispatcher.write(payload)')
    dispatcher.write({label: 'foo', method: 'getValue', value: 'FOO'})
})
