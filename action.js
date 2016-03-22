var stream   = require('readable-stream')
var inherits = require('inherits')
var xtend    = require('xtend')
var mutable  = require('xtend/mutable')

inherits(Action, stream.Readable)
module.exports = Action

function Action (label, _opt, _role) {
    if (!(this instanceof Action)) return new Action(label, _opt, _role)
    stream.Readable.call(this, {objectMode: true})
    this.label = label
    this.opt   = xtend(_opt)
    _role && mutable(this, _role)
}

Action.prototype._read = function () {}

Action.prototype.push = function (method, value) {
    return stream.Readable.prototype.push.apply(this, [{
        label: this.label
      , method: method
      , value: value
    }])
}

Action.prototype.error = function (err) {
    return this.emit('error', err)
}
