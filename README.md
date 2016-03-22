# flux-koime

library that implements the Flux architecture in Nodejs Stream.

## feature

`flux-koime` provides Action.prototype, Store.prototype and Function for them to `pipe`.

```
User --> Action-(pipe)->[Dispatcher]-(pipe)->Store -(emit "data" event)-> Component
```

## usage

```js
var React    = require('react')
var ReactDOM = require('react-dom')

var App = React.createClass({
    render: function () {
        return (
            <section>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        ref="todoText"
                        placeholder="input todo"
                        required
                    />
                </form>
                <ul>
                    {this.state.todos.map(map)}
                </ul>
            </section>
        )
        function map (todo, i) {
            return (<li key={i}>{todo}<li>)
        }
    }
  , handleSubmit: function (ev) {
        ev.preventDefault()
        this.props.context.actionTodo.addTodo(this.refs.todoText.value)
    }
  , getInitialState: function () {
        return {todos: []}
    }
  , componentDidMount: function () {
        var c = this.props.context
        c.storeTodo.on('data', function (todos) {
            this.setState({todos: todos})
        }.bind(this))
        c.actionTodo.getList()
    }
})

// api
var levelup = require('levelup')
var storageAPI = levelup('TodoList', {
    db: require('localstorage-down')
})
// actions
var ActionTodo = require('./actions/todolist')
var actionTodo = new ActionTodo(storageAPI)
// stores
var StoreTodo  = require('./stores/todolist')
var storeTodo  = new StoreTodo

// actions pipe dispatchr pipe stores
require('flux-koime')(
    actionTodo
)(
    storeTodo
)(function onError (err) {
    console.error(err)
})

ReatDOM.render(
    <App context={{
        actionTodo: actionTodo
      , storeTodo:  storeTodo
    }}>
  , document.querySelector('#react-app')
)
```

```js
// ./actions/todolist.js
var Action = require('flux-koime/action')
var inherits = require('inherits')

inherits(ActionTodo, Action)
module.exports = ActionTodo

function ActionTodo (storageAPI) {
    // "Todo" is "label", required
    Action.call(this, 'Todo')
    this.api = storageAPI
}

ActionTodo.prototype.addTodo = function (todoStr) {
    var key = encodeURIComponent(todoStr)
    this.api.put(key, todoStr, function (err) {
        if (err) return this.error(err) // Action.prototype provides `.error` method
        this.getList()                  // emit("data", {label: "Error", method: "error", value: err})
    }.bind(this))
}
ActionTodo.prototype.getList = function () {
    var buf = []
    this.api.createReadStream()
        .on('data', function (data) {
            buf.push(data.value)
        })
        .once('end', function () {
            // Action.prototype provides `.push` mehod
            // emit("data", {label: "Todo", method: "getTodos", value: buf})
            this.push('getTodos', buf)
        }.bind(this))
        .on('error', this.error.bind(this))
}
```

```js
// ./stores/todolist.js
var Store    = require('flux-koime/store')
var inherits = require('inherits')
var clone    = require('clone')

inherits(StoreTodo, Store)
module.exports = StoreTodo

function StoreTodo () {
    // "Todo" is "label", required
    Store.call(this, 'Todo')
    this.todos = []
}

StoreTodo.prototype.getTodos = function (todos, done) {
    // 1st argument is recieved data from action
    // 2nd argument is function
    done(null, (this.todos = clone(todos))
    // done(err, data)
}
```

### author

ishiduca@gmail.com


## licence

MIT
