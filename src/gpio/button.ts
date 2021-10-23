import EventListener from 'events'
import { Gpio as GpioOnOff } from 'onoff'
import { Gpio as GpioMock } from './mock'
import { Gpio } from './index'

export type buttonOptions = {
  pin: number
  mode: 'in'
  edge: 'rising'
  button: null
}

export class Button extends EventListener {
  private options: buttonOptions
  private timer: ReturnType<typeof setTimeout>
  private delay: ReturnType<typeof setTimeout>
  private button: GpioOnOff|GpioMock
  private value: number
  private fresh: boolean

  constructor (options: buttonOptions) {
    super()

    this.options = options

    this.timer = null
    this.delay = null

    this.button = new Gpio(this.options.pin, 'in', 'both', { debounceTimeout: 25 })
    this.button.watch(this._watch.bind(this))
    this.value = 0

    this.fresh = true
  }

  _watch (err, value) {
    if (err) return false

    if (value === this.value) return
    this.value = value

    if (value) {
      // rising

      this.emit('rising')

      if (this.delay) {
        // previous toggle event not yet emitted

        this._removeEmit()
        this.emit('double')
        this.fresh = false
      }

      this.startTimer()
    } else {
      // falling

      this.emit('falling')

      if (this.timer) {
        // short press button
        this.removeTimer()

        if (this.fresh) {
          // no double event emitted
          this._emit('toggle')
        } else {
          // double event emitted
          this.fresh = true
        }
      } else {
        // held button down and released
        this.emit('stop')
      }
    }
  }

  private startTimer () {
    this.timer = setTimeout(() => {
      this.emit('start')
      this.removeTimer()
    }, 1000)
  }

  private removeTimer () {
    clearTimeout(this.timer)
    this.timer = null
  }

  private _emit (value) {
    this.delay = setTimeout(() => {
      this.emit(value)
      this._removeEmit()
    }, 200)
  }

  private _removeEmit () {
    clearTimeout(this.delay)
    this.delay = null
  }
}
