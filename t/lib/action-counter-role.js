var COUNT = 'count'
module.exports = {
    plus:  function () { this.push(COUNT, 1) }
  , minus: function () { this.push(COUNT, -1) }
}
