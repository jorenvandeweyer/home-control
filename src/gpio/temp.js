const EventEmitter = require('events')
require('tty')

class Mockery extends EventEmitter {
    constructor () {
        super()

        this.stdin = process.stdin
        this.stdin.resume()
        this.stdin.setRawMode(true)

        this.stdin.on('data', (key) => {
            if ( key.toString() === '\u0003' ) {
                process.exit();
              }
            console.log(key.toString(), '\u0003', key === '\u0003')
        })
    }

    listen () {

    }
}

function main () {
    const mockery = new Mockery()

    mockery.on('key', (event) => {
        console.log('pressed key', event)
    })
}

try {
    main()
} catch (e) {
    console.log('error', e)
}
