const EventListener = require('events');
const Gpio = require('./index');

module.exports = class Button extends EventListener {
    constructor(options) {
        super();
        this._options = options;

        this._timer = null;
        this._delay = null;

        this._button = new Gpio(this._options.pin, 'in', 'both', {debounceTimeout: 25});
        this._button.watch(this._watch.bind(this));

        this._value = 0;

        this._presses = 0;
    }

    _watch(err, value) {
        if (err) return false;

        if (value === this._value) return;
        this._value = value;

        if (value) {
            //rising

            this.emit('rising');
            this._startTimer();
        } else {
            //falling

            this.emit('falling');

            if (this._timer) {
                // short press button
                this._removeTimer();

                if (this._delay) {
                    this._removeEmit()
                    this.emit('double');
                } else {
                    this._emit('toggle');
                }
            } else {
                // held button down and released
                this.emit('stop');
            }

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

    _emit(value) {
        this._delay = setTimeout(() => {
            this.emit(value);
            this._removeEmit();
        }, 400);
    }

    _removeEmit() {
        clearTimeout(this._delay);
        this._delay = null;
    }
}
