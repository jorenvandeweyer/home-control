import client from 'prom-client'
import youless from './youless'
import sma from './sma'

const Registry = client.Registry

const register = new Registry()

// eslint-disable-next-line no-unused-vars
const powerGauge = new client.Gauge({
  name: 'home_control_power_usage',
  help: 'home_control_power_usage',
  registers: [register],
  async collect () {
    try {
      const status = await youless.status()
      this.set(status?.pwr)
    } catch (e) {}
  }
})

sma.registerMetrics(register)

export default register
