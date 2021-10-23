import axios, { AxiosInstance } from 'axios'
import https from 'https'
import client, { Gauge } from 'prom-client'

class SunnyBoy {
  instance: AxiosInstance
  options: Record<string, string>
  keys: string[]
  keysMap: Record<string, string>
  sid: string
  metrics: Record<string, Gauge<string>>

  constructor () {
    this.sid = null

    this.options = {}
    this.keys = []
    this.keysMap = {}

    this.instance = axios.create({
      baseURL: 'https://192.168.1.20',
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })

    this.metrics = {
      battery_soc: null,
      battery_power_charging: null,
      battery_power_discharging: null,
      battery_invertor_power: null,
      grid_power_absorbing: null,
      grid_power_supplying: null
    }

    this.init()
  }

  init () {
    this.options = {
      grid_power_absorbing: '6100_40463700',
      grid_power_supplying: '6100_40463600',
      battery_temp: '6100_40495B00', // ºC
      battery_soc: '6100_00295A00', // %
      battery_voltage: '6100_00495C00', // V
      battery_current: '6100_40495D00', // A
      battery_invertor_power: '6100_40263F00', // W
      battery_energy_charge_total: '6400_00496700', // Wh
      battery_energy_discharge_total: '6400_00496800', // Wh
      battery_operating_status: '6180_08495E00', // 2292 = Charge battery, 2293 = Discharge battery,
      battery_power_charging: '6100_00496900', // W
      battery_power_discharging: '6100_00496A00', // W
      battery_capacity: '6100_00696E00', // %
      battery_inverter_power_limit: '6800_00832A00', // W
      battery_condition: '6180_08214800'
    }

    this.keys = Object.values(this.options)

    const entries = Object.entries(this.options)

    for (const entry of entries) {
      this.keysMap[entry[1]] = entry[0]
    }
  }

  async login () {
    const res = await this.instance.post<any>('/dyn/login.json', {
      right: 'usr',
      pass: 'Vandeweyer1!'
    })

    this.sid = res.data.result.sid
  }

  async getPoint () {
    try {
      if (!this.sid) {
        await this.login()
      }

      const res = await this.instance.post<any>(`/dyn/getValues.json?sid=${this.sid}`, {
        destDev: [],
        keys: ['6100_004F4E00', '6800_0883D800', '6100_002F7A00', '6800_0883D900', '6400_00432200', '6400_00496700', '6400_00496800', '6100_00295A00', '6180_08495E00', '6100_00496900', '6100_00496A00', '6100_00696E00', '6100_40263F00', '6800_00832A00', '6180_08214800', '6180_08414900', '6400_00462500', '6400_00462400', '6100_40463700', '6100_40463600', '6800_08862500', '6182_08434C00', '6100_4046F200', '6800_008AA200', '6400_00260100', '6100_402F2000', '6100_402F1E00', '6800_088F2000', '6800_088F2100', '6800_10852400', '6800_00853400', '6180_08652600', '6800_00852F00', '6180_08652400', '6180_08653A00', '6100_00653100', '6100_00653200', '6800_08811F00', '6400_00462E00']
      })

      const values = res.data.result['0169-B388D55E']

      const result: Record<string, number> = {}

      for (const value in values) {
        if (this.keys.includes(value)) {
          result[this.keysMap[value]] = values[value]['7'][0]?.val
        }
      }

      return result
    } catch (e) {
      console.log(e)
      this.sid = null
    }
  }

  async test () {
    const data = await this.getPoint()

    console.log(data)
  }

  registerMetrics (register) {
    this.metrics.battery_soc = new client.Gauge({
      name: 'sma_battery_soc',
      help: 'sma_battery_soc',
      registers: [register]
    })

    this.metrics.battery_power_charging = new client.Gauge({
      name: 'sma_battery_power_charging',
      help: 'sma_battery_power_charging',
      registers: [register]
    })

    this.metrics.battery_power_discharging = new client.Gauge({
      name: 'sma_battery_power_discharging',
      help: 'sma_battery_power_discharging',
      registers: [register]
    })

    this.metrics.battery_invertor_power = new client.Gauge({
      name: 'sma_battery_invertor_power',
      help: 'sma_battery_invertor_power',
      registers: [register]
    })

    this.metrics.grid_power_absorbing = new client.Gauge({
      name: 'sma_grid_power_absorbing',
      help: 'sma_grid_power_absorbing',
      registers: [register]
    })

    this.metrics.grid_power_supplying = new client.Gauge({
      name: 'sma_grid_power_supplying',
      help: 'sma_grid_power_supplying',
      registers: [register]
    })
  }

  async updateMetrics () {
    const data = await this.getPoint()

    this.metrics.battery_soc.set(data.battery_soc)
    this.metrics.battery_power_charging.set(data.battery_power_charging)
    this.metrics.battery_power_discharging.set(data.battery_power_discharging)
    this.metrics.battery_invertor_power.set(data.battery_invertor_power)

    this.metrics.grid_power_absorbing.set(data.grid_power_absorbing)
    this.metrics.grid_power_supplying.set(data.grid_power_supplying)
  }
}

const sma = new SunnyBoy()

sma.init()

export default sma
