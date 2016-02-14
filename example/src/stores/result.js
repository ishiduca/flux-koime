var inherits = require('inherits')
var clone    = require('clone')
var Store    = require('flux-koime/store')

inherits(StoreResult, Store)
module.exports = StoreResult

function StoreResult () {
    Store.call(this, 'Result')
    this.results = []
}

StoreResult.prototype.getData = function (txt, done) {
    var results = clone(this.results).concat([txt])
    done(null, (this.results = results))
}
