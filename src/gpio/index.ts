// export const Gpio = process.env.HOST === 'rpi'
//   ? (await import('onoff')).Gpio
//   : (await import('./mock')).Gpio

export const Gpio = process.env.HOST === 'rpi'
  ? require('onoff').Gpio as typeof import('onoff').Gpio
  : require('./mock').Gpio as typeof import('./mock').Gpio

// module.exports = process.env.HOST === 'rpi'
//   ? require('onoff').Gpio as typeof import('onoff').Gpio
//   : require('./mock').Gpio as typeof import('./mock').Gpio
