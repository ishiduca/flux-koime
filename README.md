# flux-koime

library that implements the Flux architecture in Nodejs Stream.

## feature

`flux-koime` provides Action.prototype, Store.prototype and Function for them to `pipe`.

```
User --> Action-(pipe)->[Dispatcher]-(pipe)->Store -(emit "data" event)-> Component
```

## usage

```js:main.js
var React    = require('react')
var ReactDOM = require('react-dom')
var action   = require('flux-koime/action')
var store    = require('flux-koime/store')
var pipes    = require('flux-koime')
// vars
var TAP = 'Tap'
// actions, stores
var actTap   = action(TAP, null, require('./action-tap')
var storeTap = store( TAP, {store: require('./api-tap')}, require('./store-tap'))
// pipes and handle error
pipes(actTap)(storeTap)(function onError (err) {
    console.error(err)
})
// components
var App = require('./component-app')
// mount
ReactDOM.render(<App context={{
    actTap: actTap
  , storeTap: storeTap
}}, document.querySelector('#react-app'))
```

```js:action-tap.js
var method = 'sum'
module.exports = {
    _tap: function (n) {
        this.push(method, n)
    }
   , plus: function () {
        this._tap(1)
    }
  , minus: function () {
        this._tap(-1)
    }
}
```

```js:store-tap.js
module.exports = {
    sum: function (n, done) {
        this.opt.store.put(n)
        done(null, this.getStoreSum())
    }
  , getStoreSum: function () {
        return this.opt.store.sum()
    }
}
```

```js:api-tap.js
module.exports = {
    _buff: []
  , put: function (n) {
        this._buff = this._buff.concat(n)
    }
  , sum: function () {
        return this._buff.reduce(function (a, b) {
            return a + b
        }, 0)
    }
}
```

```js:component-app.js
var React = require('react')
var App = React.createClass({
    render: function () {
        var tap = this.props.context.actTap
        return (
            <div>
                <div>
                    <button
                        type="button"
                        onClick={tap.plus.bind(tap)}
                    >+</button>
                    <button
                        type="button"
                        onClick={tap.minus.bind(tap)}
                    >-</button>
                </div>
                <div>{this.state.sum}</div>
            </div>
        )
    }
  , getInitialState: function () {
        return {sum: 'not tap yet'}
    }
  , componentDidMount: function () {
        this.props.context.storeTap.on('data', function (sum) {
            this.setState({sum: sum}
        })
    }
  , componentWillUnmount: function () {
        this.props.context.storeTap.removeAllListeners()
    }
})
module.exports = App

## api

### var Action = require('flux-koime/action')

`var actionCreator = new Action(label[, {opt}, {role}])`

`actionCreator` is an implementation of `stream.Readable`.

* `label` - indentifier for specifying the destination to becomee store of data. it sends data to store with the same label.
* `{opt}` - to specify the settings, resource and API to be used in this actionCreator. access to this resource in the `this.opt.xxx`.
* `{role}` - role.

#### method

* `.push(method, data)`
** `method` - specifies whether to pass the data to whitch method of destination of store. --store must implement that method.
** `data` - data to be passed to the store.

### var Store = require('flux-koime/store')

`var store = new Store(label[, {opt}, {role}])`

`store` is an implementation of `stream.Transform`.

* `label` - see `Action`
* '{opt}' - see `Action`
* '{role}' - see `Action`

#### method

store must implement the method to receive the data to be passed from actionCreator.

```js
// ex
SomeStore.prototype.getDate = function (_data, callback) {
    try {
        var data = doSomething(_data)
        callback(null, data)
    } catch (err) {
        callback(err)
    }
}
```

### var setActionsFunc = require('flux-koime')

var setActions  = require('flux-koime')
var doPipe      = setActions(action1, action2, ...)
var handleError = doPipe(store1, store2, ...)

handleError(function (err) {
    ...
})

### author

ishiduca@gmail.com


## licence

MIT
