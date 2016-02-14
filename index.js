var defined    = require('defined')
var Dispatcher = require('./_dispatcher')

module.exports = function (actions_and_stores) {
    actions_and_stores || (actions_and_stores = {})
    var context    = {}
    var dispatcher = new Dispatcher

    dispatcher.setMaxListeners(0)
    dispatcher.on('unpipe', function (action) { action.pipe(this) })

    defined(actions_and_stores.actions, []).forEach(function (action) {
        action.pipe(dispatcher, {end: false})
        ;(context.actions || (context.actions = [])).push(action)
    })

    defined(actions_and_stores.stores, []).forEach(function (store) {
        dispatcher.pipe(store, {end: false}).on('unpipe', function (_dispatcher) { _dispatcher.pipe(this) })
        ;(context.stores || (context.stores = [])).push(store)
    })

    return context
}
