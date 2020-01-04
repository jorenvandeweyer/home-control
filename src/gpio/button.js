const EventListener = require('events');
const Gpio = require('./index');

module.exports = class Button extends EventListener {
    constructor(options) {
        super();
        this._options = options;

        this._timer = null;

        this._button = new Gpio(this._options.pin, 'in', 'both');
        this._button.watch(this._watch.bind(this));
    }

    _watch(err, value) {
        if (err) return false;

        if (value) {
            //rising

            this.emit('rising');
            this._startTimer();
        } else {
            //falling

            this.emit('falling');

            if (this._timer) {
                this._removeTimer();
                this.emit('toggle');
                return;
            }

            this.emit('stop');
        }
    }

    _startTimer() {
        this._timer = setTimeout(() => {
            this.emit('start');
            this._removeTimer();
        }, 1000);
    }

    _removeTimer() {
        clearTimeout(this._timer);
        this._timer = null;
    }
}
