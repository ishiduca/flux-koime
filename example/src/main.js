var React    = require('react')
var ReactDOM = require('react-dom')
var App      = require('./components/app')

var ActHyperquest = require('./actions/load')
var actHyper = new ActHyperquest

var StoreResult = require('./stores/result')
var storeResult = new StoreResult

var koime = require('flux-koime')

koime({
    actions: [actHyper]
  , stores:  [storeResult]
})

ReactDOM.render(
    <App context={{
        actHyper: actHyper
      , storeResult: storeResult
    }} />
  , document.querySelector('#react-app')
)
