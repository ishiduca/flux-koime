'use strict'
var test = require('tape')
var clone = require('clone')
var Store = require('../store')
var counterRole = require('./lib/store-counter-role')
var StoreTodo   = require('./lib/store-todo')
var StoreTodo   = require('./lib/store-todo')
var StoreTodo   = require('./lib/store-todo')
var StoreTodo   = require('./lib/store-todo')

test('var store = new Store(label, _opt, _role)', (t) => {
    var store = new Store('Foo', {list: []}, {getList: getList})

    function getList (data, done) {
        var list = clone(this.opt.list).concat([clone(data)])
        done(null, (this.opt.list = list))
    }

    var spy = []

    store.on('data', function (list) {
        spy.push(list)
    })
    .once('end', function () {
        t.ok(1, 'store ended')
        t.is(spy.length, 3, 'spy.length === 3')
        t.deepEqual(spy[0], ['abc'], 'spy[0] deepEqual ["abc"]')
        t.deepEqual(spy[1], ['abc', 'def'], 'spy[1] deepEqual ["abc","def"]')
        t.deepEqual(spy[2], ['abc', 'def', 'ghi'], 'spy[2] deepEqual ["abc","def","ghi"]')
        t.end()
    })

    store.write({label: 'Foo', method: 'getList', value: 'abc'})
    store.write({label: 'Foo', method: 'getList', value: 'def'})
    store.write({label: 'Foo', method: 'getList', value: 'ghi'})
    store.write({label: 'Foo', method: 'notExistsMethod', value: 'xyz'})
    store.end()
})

test('var store = new Store(label, _opt, _role) # use role', (t) => {
    var COUNTER = 'counter'
    var METHOD  = 'count'
    var store   = Store(COUNTER, {count: 0}, counterRole)
    var spy     = []

    store.on('data', (value) => {
        spy.push(value)
    })
    .once('end', () => {
        t.ok(1, 'store ended')
        t.is(spy.length, 3, 'store emit data 3 times')
        t.is(spy[0], 1, 'spy[0] is 1')
        t.is(spy[1], 0, 'spy[0] is 0')
        t.is(spy[2], 12, 'spy[2] is 12')
        t.end()
    })

    store.write({label: COUNTER, method: METHOD, value: 1})
    store.write({label: COUNTER, method: METHOD, value: -1})
    store.write({label: COUNTER, method: 'noExistsMethod', value: -1})
    store.write({label: COUNTER, method: METHOD, value: 12})
    store.end()
})

test('var storeTodo = new StoreTodo # inherits', (t) => {
    var LABEL  = 'Todo'
    var METHOD = 'getTodo'
    var store  = new StoreTodo
    var spy    = []

    store.on('data', (value) => {
        spy.push(value)
    })
    .once('end', () => {
        t.ok(1, 'store ended')
        t.is(spy.length, 3, 'store emit data 3 times')
        t.deepEqual(spy[0], {foo: 'FOO'}, JSON.stringify(spy[0]))
        t.deepEqual(spy[1], {foo: 'FOO', bar: 'BAR'}, JSON.stringify(spy[1]))
        t.deepEqual(spy[2], {foo: 'FOO', bar: 'BAR', zepp: 'ZEPP'}, JSON.stringify(spy[2]))
        t.end()
    })

    store.write({label: LABEL, method: METHOD, value: {key: 'foo', value: 'FOO'}})
    store.write({label: LABEL, method: METHOD, value: {key: 'bar', value: 'BAR'}})
    store.write({label: LABEL, method: METHOD, value: {key: 'zepp', value: 'ZEPP'}})
    store.end()
})
