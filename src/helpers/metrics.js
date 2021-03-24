const client = require('prom-client');
const youless = require('./youless')

const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;

const register = new Registry();

const powerGauge = new client.Gauge({
  name: 'home_control_power_usage',
  help: 'home_control_power_usage',
  registers: [register],
  async collect () {
    const status = await youless.status()
    this.set(status?.pwr)
  }
})

module.exports = register
