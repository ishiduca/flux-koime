var stream   = require('readable-stream')
var inherits = require('inherits')

inherits(Store, stream.Transform)
module.exports = Store

function Store (label) {
    stream.Transform.call(this, {objectMode: true})
    this.label = label
}

Store.prototype._transform = function (payload, enc, done) {
    if (this.label === payload.label && 'function' === typeof this[payload.method])
        this[payload.method](payload.value, done)
    else
        done()
}
