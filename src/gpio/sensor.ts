const EventListener = require('events')
const Gpio = require('./index')

export class Sensor extends EventListener {
  constructor (options) {
    super()

    this._options = options

    this._sensor = new Gpio(this._options.pin, 'in', 'both', { debounceTimeout: 25 })
    this._sensor.watch(this._watch.bind(this))

    this._value = 0
  }

  _watch (err, value) {
    if (err) return false

    if (value === this._value) return
    this._value = value

    if (value) {
      // rising
      this.emit('rising')
    } else {
      // falling
      this.emit('falling')
    }
  }
}
