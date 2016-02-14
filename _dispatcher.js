var stream   = require('readable-stream')
var inherits = require('inherits')

inherits(Dispatcher, stream.Transform)
module.exports = Dispatcher

function Dispatcher () {
    stream.Transform.call(this, {objectMode: true})
}

Dispatcher.prototype._transform = function (payload, enc, done) {
    done(null, payload)
}
