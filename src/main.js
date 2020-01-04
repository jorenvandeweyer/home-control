require('dotenv').config();
const Gpio = require('./gpio');
const Hue = require('./hue');
const mapping = require('./light-mapping');

const hue = new Hue(process.env.HUE_USER);

hue.on('ready', () => {
    console.log('ready');

    mapping.forEach(async conf => {
        const group = await hue.groups.findById(conf.to.index);
        const button = new Gpio(conf.from.pin, conf.from.mode, conf.from.edge);
        button.watch((err, value) => {
            group.toggle();
        });
    });
});

hue.on('error', (msg) => {
    console.log('error:', msg);
});
