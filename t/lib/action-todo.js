var Action = require('../../action')
var inherits = require('inherits')

inherits(ActTodo, Action)
module.exports = ActTodo

var getTodo = 'getTodo'

function ActTodo (storageAPI) {
    Action.call(this, 'Todo')
    this.storage = storageAPI
}

ActTodo.prototype.addTodo = function (todo) {
    var me  = this
    var key = encodeURIComponent(todo)
    this.storage.put(key, todo, function (err) {
        err ? me.error(err)
            : me.push(getTodo, {key: key, value: todo})
    })
}
