'use strict'
var test = require('tape')
var clone = require('clone')
var Store = require('../store')

test('var store = new Store(name)', (t) => {
    var store = new Store('Foo')
    store.list = []

    store.getList = function (data, done) {
        var list = clone(this.list).concat([clone(data)])
        done(null, list)
        this.list = list
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

    store.write({name: 'Foo', method: 'getList', value: 'abc'})
    store.write({name: 'Foo', method: 'getList', value: 'def'})
    store.write({name: 'Foo', method: 'getList', value: 'ghi'})
    store.write({nmee: 'Foo', method: 'notExistsMethod', value: 'xyz'})
    store.end()
})
