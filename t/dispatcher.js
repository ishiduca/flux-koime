'use strict'
var test = require('tape')
var Dispatcher = require('../_dispatcher')

test('var dispatcher = new Dispatcher', (t) => {
    var dispatcher = new Dispatcher
    dispatcher.once('data', (payload) => {
        t.ok(payload, 'dispatcher.on("data", (payload) => {})')
        t.deepEqual(payload, {name: 'foo', method: 'getValue', value: 'FOO'}
          , "payload deepEqual {name: 'foo', method: 'getValue', value: 'FOO'}")
        t.end()
    })

    console.log('# dispatcher.write(payload)')
    dispatcher.write({name: 'foo', method: 'getValue', value: 'FOO'})
})
