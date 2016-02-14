var React = require('react')

var App = React.createClass({
    render: function () {
        return (
            <section>
                <button
                    value="data/timtowtdi"
                    onClick={this.handleClick}
                >
                    load &quot;TIMTOWTDI&quot;
                </button>
                <button
                    ref="load_txt"
                    value="data/the-zen-of-python"
                    onClick={this.handleClick}
                >
                    load &quot;The Zen of Python&quot;
                </button>
                <div>
                    {this.state.texts.map(map)}
                </div>
            </section>
        )
        function map (_text, i) {
            return (<pre key={i}>{_text}</pre>)
        }
    }
  , handleClick: function (ev) {
        ev.preventDefault()
        this.props.context.actHyper.load(location.href + ev.target.value)
    }
  , getInitialState: function () {
        return {texts: []}
    }
  , componentDidMount: function () {
        var me = this
        this.props.context.storeResult.on('data', function (texts) {
            me.setState({texts: texts})
        })
    }
})

module.exports = App
