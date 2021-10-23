import { Direction, Edge, ValueCallback } from 'onoff'

export class Gpio {
  private pin: number
  private direction: Direction
  private edge: Edge

  constructor (pin: number, direction: Direction, edge?: Edge) {
    this.pin = pin
    this.direction = direction
    this.edge = edge
  }

  watch (fn: ValueCallback) {
    console.log(`mocked watch for pin ${this.pin}`)
  }
}
