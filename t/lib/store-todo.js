var Store    = require('../../store')
var inherits = require('inherits')
var xtend    = require('xtend')
var clone    = require('clone')

inherits(StoreTodo, Store)
module.exports = StoreTodo

function StoreTodo () {
    Store.call(this, 'Todo')
    this.store = {}
}

StoreTodo.prototype.getTodo = function (pair, done) {
    var err
    if (! pair)             err = new Error('"pair" not found')
    if (!("key" in pair))   err = new Error('"pair.key" not found')
    if (!("value" in pair)) err = new Error('"pair.value" not found')

    if (err) {
        done()
        return this.emit('error', err)
    }

    var data = {}
    data[pair.key] = pair.value
    done(null, (this.store = xtend(clone(this.store), data)))
}
