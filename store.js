var stream   = require('readable-stream')
var inherits = require('inherits')
var xtend    = require('xtend')
var mutable  = require('xtend/mutable')

inherits(Store, stream.Transform)
module.exports = Store

function Store (label, _opt, _role) {
    if (!(this instanceof Store)) return new Store(label, _opt, _role)
    stream.Transform.call(this, {objectMode: true})
    this.label = label
    this.opt   = xtend(_opt)
    _role && mutable(this, _role)
}

Store.prototype._transform = function (payload, enc, _done) {
    var me   = this
    if (this.label === payload.label && 'function' === typeof this[payload.method])
        this[payload.method](payload.value, done)
    else
        done()

    function done (err, data) {
        if (err) me.emit('error', err)
        _done(null, data)
    }
}
