module.exports = {
    count: function (num, done) {
        done(null, (this.opt.count += num))
    }
}
