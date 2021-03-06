'use strict'
var test = require('tape')
var through = require('through2')
var Action = require('../action')
var counterRole = require('./lib/action-counter-role')
var ActTodo = require('./lib/action-todo')

var stream = require('readable-stream')

test('var act = new Action(label)', (t) => {
    var act = new Action('foo')
    act.say = function (hello) {
        if (hello instanceof Error) return this.error(hello)
        this.push('getValue', hello)
    }

    var spy  = []
    var errs = []

    act.on('error', (err) => {
        errs.push(err)
    }).on('data', (payload) => {
        spy.push(payload)
    })
    .once('end', () => {
        t.ok(1, 'act ended')
        t.is(spy.length, 2, 'spy.length === 2')
        t.deepEqual(spy[0], {label: 'foo', method: 'getValue', value: 'HELLO'}
          , "spy[0] deepEqual {label: 'foo', method: 'getValue', value: 'HELLO'}")
        t.deepEqual(spy[1], {label: 'foo', method: 'getValue', value: 'KOIME'}
          , "spy[1] deepEqual {label: 'foo', method: 'getValue', value: 'KOIME'}")

        t.is(errs.length, 1, 'errs.length === 1')
        t.is(errs[0].message, 'hoge', 'errs[0].message === "hoge"')
        t.end()
    })

    act.say('HELLO')
    act.say(new Error('hoge'))
    act.say('KOIME')
    stream.Readable.prototype.push.apply(act, [null])
})

test('var act = new Action(label, _opt, _role) # use role', (t) => {
    var COUNTER = 'counter'
    var METHOD  = 'count'
    var act = Action(COUNTER, null, counterRole)
    var spy = []

    act.on('data', (count) => {
        spy.push(count)
    }).once('end', () => {
        t.is(spy.length, 3, 'spy.length === 3')
        t.deepEqual(spy[0], {label: COUNTER, method: METHOD, value: -1}, JSON.stringify(spy[0]))
        t.deepEqual(spy[1], {label: COUNTER, method: METHOD, value: 1}, JSON.stringify(spy[1]))
        t.deepEqual(spy[2], {label: COUNTER, method: METHOD, value: 1}, JSON.stringify(spy[2]))
        t.end()
    })

    act.minus()
    act.plus()
    act.plus()
    stream.Readable.prototype.push.apply(act, [null])
})

test('var actTodo = new ActTodo(API) # custom action creator', (t) => {
    var API = {
        source: {}
      , put: function (key, value, done) {
            if ('string' !== typeof key || key === '') return done(new Error('"key" not found'))
            if (undefined === value || null === value) return done(new Error('"value" not found'))
            this.source[key] = value
            done()
        }
    }
    var actTodo = new ActTodo(API)

    var spy  = []
    var errs = []

    actTodo.on('error', (err) => {
        errs.push(err)
    }).on('data', (payload) => {
        spy.push(payload)
    })
    .once('end', () => {
        t.ok(1, 'actTodo ended')
        t.is(spy.length, 1, 'spy.length === 1')
        t.is(errs.length, 1, 'errs.length === 1')
        t.deepEqual(spy[0], {label: 'Todo', method: 'getTodo', value: {key: 'beep%20boop', value: 'beep boop'}}
          , "spy[0] deepEqual {label: 'Todo', method: 'getTodo', value: {key: 'beep%20boop', value: 'beep boop'}}")
        t.deepEqual(errs[0], new Error('"key" not found'), "spy[1] deepEqual new Error('\"key\" not found')")
        t.end()
    })

    actTodo.addTodo('beep boop')
    actTodo.addTodo()
    stream.Readable.prototype.push.apply(actTodo, [null])
})
