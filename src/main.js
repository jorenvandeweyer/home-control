// const Gpio = require('onoff').Gpio;
// const led = new Gpio(17, 'out');
// const button = new Gpio(4, 'in', 'both');
 
// button.watch((err, value) => led.writeSync(value));

// process.on('SIGINT', _ => {
//     led.unexport();
//     button.unexport();
//   });
const v3 = require('node-hue-api').v3;
require('node-hue-api').v3.model.lightStates;

async function main() {
    const bridge = await v3.discovery.nupnpSearch();
    const api = await v3.api.createLocal(bridge[0].ipaddress).connect(process.env.HUE_USER);
    const groups = await api.groups.getAll();

    // groups.forEach(group => console.log(group.toStringDetailed()))

    api.groups.setGroupState(6, new v3.model.lightStates.GroupLightState().on())
}

main();
