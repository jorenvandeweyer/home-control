const axios = require('axios');

class Youless {
  constructor () {
    this.address = null
    this.last = Date.now()

    this.init()
  }

  async init () {
    if (this.last > Date.now() - 60000) return

    this.last = Date.now()

    const instance = axios.default.create({
      timeout: 2000,
    })

    const possibilities = Array.from(new Array(254).keys())

    const promises = possibilities.map(async number => {
      try {
        const address = `http://192.168.1.${number + 1}/a?f=j`
        await instance.get(address)
        return address
      } catch (e) {
        return null
      }
    })

    const results = await Promise.all(promises)

    const youless = results.filter(addr => addr)

    if (youless.length) {
      this.address = youless[0]
    }
  }

  async status () {
    if (!this.address) {
      this.init()
    }

    try {
      const res = await axios.get(this.address)

      return res.data
    } catch (e) {
      this.address = null
      this.init()
    }
  }
}

const youless = new Youless()

module.exports = youless
