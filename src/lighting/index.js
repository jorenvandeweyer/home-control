const Button = require('../gpio/button');
const mapping = require('./light-mapping');
const { Hue } = require('hue');

const hue = new Hue(null, process.env.HUE_USER)

hue.on('ready', (bridge) => {
    console.log('ready');

    mapping.forEach(async conf => {
        const button = new Button(conf.from);

        ['rising', 'falling', 'toggle', 'double', 'start', 'stop'].forEach(event => {
            button.on(event, _ => console.log(conf.from.pin, Date.now(), event));
        })

        if (!conf.to.index) return;

        const group = await bridge.Group.one(conf.to.index);

        button.on('toggle', _ => group.toggle());
        button.on('double', _ => group.setState({
            on: true,
            bri: 254,
        }));
        button.on('start', _ => group.dim());
        button.on('stop', _ => group.freeze());
    });
});

hue.on('error', (msg) => {
    setTimeout(() => {
        hue.connect();
    }, 30*1000);
    console.log('reconnecting bridge in 30 seconds');
    console.log('error:', msg);
});
