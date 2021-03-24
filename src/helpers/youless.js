const axios = require('axios');

class Youless {
  constructor () {

  }

  async status () {
    const res = await axios.get('http://192.168.1.157/a?f=j')

    return res.data
  }
}

const youless = new Youless()

module.exports = youless
