import { buttonOptions } from '../gpio/button'

type Lights = {
  type: 'lights'
  items: number[]
}

type Group = {
  type: 'group'
  items: number
}

type Mapping = {
  from: buttonOptions
  to: Lights|Group
}

const mapping: Mapping[] = [
  {
    from: {
      pin: 1,
      mode: 'in',
      edge: 'rising',
      button: null
    },
    to: {
      type: 'lights',
      items: [4, 1] // room woonkamer muur
    }
  },
  {
    from: {
      pin: 9,
      mode: 'in',
      edge: 'rising',
      button: null
    },
    to: {
      type: 'lights',
      items: [12, 11, 10, 9] // room woonkamer zetel
    }
  },
  {
    from: {
      pin: 10,
      mode: 'in',
      edge: 'rising',
      button: null
    },
    to: {
      type: 'lights',
      items: [14] // room woonkamer tafel
    }
  },
  {
    from: {
      pin: 4,
      mode: 'in',
      edge: 'rising',
      button: null
    },
    to: {
      type: 'lights',
      items: [3, 2] // room woonkamer tv
    }
  },
  {
    from: {
      pin: 5,
      mode: 'in',
      edge: 'rising',
      button: null
    },
    to: {
      type: 'group',
      items: 6 // room joren
    }
  },
  {
    from: {
      pin: 6,
      mode: 'in',
      edge: 'rising',
      button: null
    },
    to: {
      type: 'group',
      items: 4 // room mama papa
    }
  },
  {
    from: {
      pin: 7,
      mode: 'in',
      edge: 'rising',
      button: null
    },
    to: {
      type: 'group',
      items: 10 // room inte
    }
  },
  {
    from: {
      pin: 8,
      mode: 'in',
      edge: 'rising',
      button: null
    },
    to: {
      type: 'group',
      items: null
    }
  }
]

export default mapping
