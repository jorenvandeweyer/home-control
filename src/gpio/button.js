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

        this._fresh = true;
    }

    _watch(err, value) {
        if (err) return false;

        if (value === this._value) return;
        this._value = value;

        if (value) {
            //rising

            this.emit('rising');

            if (this._delay) {
                //previous toggle event not yet emitted

                this._removeEmit();
                this.emit('double');
                console.log('was fresh', this._fresh)
                this._fresh = false;
                console.log('setting fresh', this._fresh)
            } else {
                this._startTimer();
            }

        } else {
            //falling

            this.emit('falling');

            if (this._timer) {
                // short press button
                this._removeTimer();

                console.log('comparing fresh', this._fresh)
                if (this._fresh) {
                    // no double event emitted
                    this._emit('toggle');
                } else {
                    // double event emitted
                    this._fresh = true;
                    console.log('setting fresh', this._fresh)
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
        }, 200);
    }

    _removeEmit() {
        clearTimeout(this._delay);
        this._delay = null;
    }
}
