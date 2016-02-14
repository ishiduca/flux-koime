'use strict'
var test = require('tape')
var through = require('through2')
var Action = require('../action')
var ActTodo = require('./lib/action-todo')

var stream = require('readable-stream')

test('var act = new Action(name, method)', (t) => {
    var act = new Action('foo', 'getValue')
    act.say = function (hello) {
        if (hello instanceof Error) return this.error(hello)
        this.push(hello)
    }

    var spy  = []

    act.on('data', (payload) => {
        spy.push(payload)
    })
    .once('end', () => {
        t.ok(1, 'act ended')
        t.is(spy.length, 2, 'spy.length === 2')
        t.deepEqual(spy[0], {name: 'foo', method: 'getValue', value: 'HELLO'}
          , "spy[0] deepEqual {name: 'foo', method: 'getValue', value: 'HELLO'}")
        t.deepEqual(spy[1], {name: 'Error', method: 'error', value: new Error('hoge')}
          , "spy[1] deepEqual {name: 'Error', method: 'error', value: new Error('hoge')}")
        t.end()
    })

    act.say('HELLO')
    act.say(new Error('hoge'))
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

    var spy = []

    actTodo.on('data', (payload) => {
        spy.push(payload)
    })
    .once('end', () => {
        t.ok(1, 'actTodo ended')
        t.is(spy.length, 2, 'spy.length === 2')
        t.deepEqual(spy[0], {name: 'Todo', method: 'getList', value: {key: 'beep%20boop', value: 'beep boop'}}
          , "spy[0] deepEqual {name: 'Todo', method: 'getList', value: {key: 'beep%20boop', value: 'beep boop'}}")
        t.deepEqual(spy[1], {name: 'Error', method: 'error', value: new Error('"key" not found')}
          , "spy[1] deepEqual {name: 'Error', method: 'error', value: new Error('\"key\" not found')}")
        t.end()
    })

    actTodo.addTodo('beep boop')
    actTodo.addTodo()
    stream.Readable.prototype.push.apply(actTodo, [null])
})
