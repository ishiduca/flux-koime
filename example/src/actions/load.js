var inherits   = require('inherits')
var hyperquest = require('hyperquest')
var Action     = require('flux-koime/action')

inherits(ActHyperquest, Action)
module.exports = ActHyperquest

function ActHyperquest () {
    Action.call(this, 'Result', 'getData')
}

ActHyperquest.prototype.load = function (uri) {
    var me  = this
    var buf = []
    hyperquest(uri)
        .once('error', this.error.bind(this))
        .on('data', function (chnk) {
            buf.push(chnk)
        })
        .once('end', function () {
            var str = Buffer.isBuffer(buf[0]) ? String(Buffer.concat(buf)) : buf.join('')
            me.push(str)
        })
}
