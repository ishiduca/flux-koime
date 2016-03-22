var stream   = require('readable-stream')
var inherits = require('inherits')

inherits(Dispatcher, stream.Transform)
module.exports = Dispatcher

function Dispatcher () {
    if (!(this instanceof Dispatcher)) return new Dispatcher()
    stream.Transform.call(this, {objectMode: true})
    this.setMaxListeners(0)
}

Dispatcher.prototype._transform = function (payload, enc, done) {
    done(null, payload)
}
