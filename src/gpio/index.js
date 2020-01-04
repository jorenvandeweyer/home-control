if (process.env.HOST === 'rpi') {
    module.exports = require('onoff').Gpio;
} else {
    module.exports = require('./mock').Gpio;
}
