import { Button } from '../gpio/button'
import mapping from './light-mapping'
import { Bridge, Hue } from 'hue'

const { HUE_BRIDGE, HUE_USER } = process.env

if (
  typeof HUE_BRIDGE !== 'string' ||
  typeof HUE_USER !== 'string'
) {
  console.log('ENV not set correctly')
  process.exit()
}

const hue = new Hue(HUE_BRIDGE, HUE_USER)

hue.on('ready', (bridge: Bridge) => {
  console.log('ready')

  mapping.forEach(async conf => {
    const button = new Button(conf.from)

    const events = ['rising', 'falling', 'toggle', 'double', 'start', 'stop']

    events.forEach(event => {
      button.on(event, () => console.log(conf.from.pin, Date.now(), event))
    })

    if (conf.to.type === 'group') {
      const group = await bridge.Group.one(conf.to.items.toString())

      button.on('toggle', _ => group.toggle())
      button.on('double', _ => group.setState({
        on: true,
        bri: 254
      }))
      button.on('start', _ => group.dim())
      button.on('stop', _ => group.freeze())
    } else if (conf.to.type === 'lights') {
      const lights = await Promise.all(
        conf.to.items.map(item => bridge.Light.one(item.toString()))
      )

      button.on('toggle', async () => {
        await Promise.all(lights.map(light => light.update()))

        const anyon = lights.some((light: any) => light.state.on)

        lights.forEach(light => anyon ? light.off() : light.on())
      })

      button.on('double', () => {
        lights.forEach(light => light.setState({ on: true, bri: 254 }))
      })

      button.on('start', () => {
        lights.forEach(light => light.dim())
      })

      button.on('stop', () => {
        lights.forEach(light => light.freeze())
      })
    }
  })

  mapping.forEach(async conf => {
    const button = new Button(conf.from);

    ['rising', 'falling', 'toggle', 'double', 'start', 'stop'].forEach(event => {
      button.on(event, () => console.log(conf.from.pin, Date.now(), event))
    })

    // if (!conf.to.items) return

    // if (conf.to.type === 'group') {

    // } else if (conf.to.type === 'light') {
    //   const lights = await Promise.all(
    //     conf.to.items.map(item => {
    //       return bridge.Light.one(item)
    //     })
    //   )

    //   button.on('double', _ => {
    //     lights.forEach(light => light.setState({
    //       on: true,
    //       bri: 254
    //     }))
    //   })

    //   button.on('toggle', _ => {
    //     await Promise.all(lights.map(light => light.update()))

    //     if (lights.some(light => light.state.on)) {
    //       lights.forEach(light => light.off())
    //     } else {
    //       lights.forEach(light => light.on())
    //     }
    //   })

    //   button.on('start', _ => {

    //   })
    // }

    // const group = await bridge.Group.one(conf.to.items)

    // button.on('toggle', _ => group.toggle())
    // button.on('double', _ => group.setState({
    //   on: true,
    //   bri: 254
    // }))
    // button.on('start', _ => group.dim())
    // button.on('stop', _ => group.freeze())
  })
})

hue.on('error', (msg) => {
  setTimeout(() => {
    hue.connect()
  }, 30 * 1000)
  console.log('reconnecting bridge in 30 seconds')
  console.log('error:', msg)
})
