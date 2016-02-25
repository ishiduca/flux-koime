var stream   = require('readable-stream')
var inherits = require('inherits')
var xtend    = require('xtend')

inherits(Action, stream.Readable)
module.exports = Action

function Action (label, method) {
    stream.Readable.call(this, {objectMode: true})
    this.label  = label
    this.method = method
    this.defaultPayload = {
        label: label
      , method: method
    }
}

Action.prototype._read = function () {}

Action.prototype.errorPayload = {
    label: 'Error'
  , method: 'error'
}

Action.prototype.push = function (value) {
    stream.Readable.prototype.push.apply(this, [xtend(this.defaultPayload, {value: value})])
}

Action.prototype.error = function (err) {
    stream.Readable.prototype.push.apply(this, [xtend(this.errorPayload, {value: err})])
}
