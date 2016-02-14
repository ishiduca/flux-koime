var Action = require('../../action')
var inherits = require('inherits')

inherits(ActTodo, Action)
module.exports = ActTodo

function ActTodo (storageAPI) {
    Action.call(this, 'Todo', 'getList')
    this.storage = storageAPI
}

ActTodo.prototype.addTodo = function (todo) {
    var me  = this
    var key = encodeURIComponent(todo)
    this.storage.put(key, todo, function (err) {
        err ? me.error(err)
            : me.push({key: key, value: todo})
    })
}
