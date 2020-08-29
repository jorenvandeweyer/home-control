require('dotenv').config();

const Button = require('./gpio/button');
const mapping = require('./light-mapping');
const { Hue } = require('hue');

const hue = new Hue(null, process.env.HUE_USER)

hue.on('ready', (bridge) => {
    console.log('ready');

    mapping.forEach(async conf => {
        const button = new Button(conf.from);

        button.on('rising', _ => console.log(conf.from.pin, 'rising'));
        button.on('falling', _ => console.log(conf.from.pin, 'falling'));
        button.on('toggle', _ => console.log(conf.from.pin, 'toggle'));
        button.on('double', _ => console.log(conf.from.pin, 'double'));

        if (!conf.to.index) return;

        const group = await bridge.Group.one(conf.to.index);

        button.on('toggle', _ => group.toggle());
        button.on('double', _ => group.setState({
            on: true,
            bri: 254
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
