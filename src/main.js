// const Gpio = require('onoff').Gpio;
// const led = new Gpio(17, 'out');
// const button = new Gpio(4, 'in', 'both');
 
// button.watch((err, value) => led.writeSync(value));



const Gpio = require('./gpio');
const v3 = require('node-hue-api').v3;
let api = null;

const map = [{
    from: {
        pin: 1,
        mode: 'in',
        edge: 'rising',
        button: null
    },
    to: {
        type: 'group',
        index: 6,
    },
}];

function handle(err, value, conf) {
    // let fn = null;

    if (conf.to.type === 'group') {
        api.groups.setGroupState(conf.to.index, v3.model.lightStates.GroupLightState().on());
    }
}


const pins = map.map(conf => {
    const button = new Gpio(conf.from.pin, conf.from.mode, conf.from.edge);
    button.watch((err, value) => handle(err, value, conf));
    conf.from.button = button;
    return conf;
});

process.on('SIGINT', _ => {
    pins.map(pin => pin.from.button.unexport());
});

async function main() {
    const bridge = await v3.discovery.nupnpSearch();
    api = await v3.api.createLocal(bridge[0].ipaddress).connect(process.env.HUE_USER);
    console.log('loaded');
    // const groups = await api.groups.getAll();
    // groups.forEach(group => console.log(group.toStringDetailed()))
    // api.groups.setGroupState(6, new v3.model.lightStates.GroupLightState().on())
}

main();
