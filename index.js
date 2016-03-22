var Dispatcher = require('./_dispatcher')

var slice = Array.prototype.slice

module.exports = function () {
    var actions = slice.apply(arguments)

    return function () {
        var stores     = slice.apply(arguments)
        var dispatcher = Dispatcher()

        actions.forEach(function (action) {
            action.pipe(dispatcher, {end: false})
        })

        dispatcher.on('unpipe', function (action) {
            action._readableState.pipes || action.pipe(dispatcher, {end: false})
        })

        stores.forEach(function (store) {
            dispatcher.pipe(store, {end: false}).on('unpipe', function (dsptchr) {
                dsptchr.pipe(this, {end: false})
            })
        })

        return function (onError) {
            dispatcher.on('error', onError)
            actions.forEach(function (action) {
                action.on('error', onError)
            })
            stores.forEach(function (store) {
                store.on('error', onError)
            })
        }
    }
}
