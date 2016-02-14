var stream   = require('readable-stream')
var inherits = require('inherits')

inherits(Store, stream.Transform)
module.exports = Store

function Store (name) {
    stream.Transform.call(this, {objectMode: true})
    this.name = name
}

Store.prototype._transform = function (payload, enc, done) {
    if (this.name === payload.name && 'function' === typeof this[payload.method])
        this[payload.method](payload.value, done)
    else
        done()
}
