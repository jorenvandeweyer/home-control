require('dotenv').config();
const Hue = require('./hue');
const Button = require('./gpio/button');
const mapping = require('./light-mapping');

const hue = new Hue(process.env.HUE_USER);

hue.on('ready', () => {
    console.log('ready');

    mapping.forEach(async conf => {
        const button = new Button(conf.from);

        button.on('rising', _ => console.log('rising', conf.from.pin));
        button.on('falling', _ => console.log('falling', conf.from.pin));

        if (!conf.to.index) return;

        const group = await hue.groups.findById(conf.to.index);

        button.on('toggle', _ => group.toggle());
        button.on('start', _ => group.start());
        button.on('stop', _ => group.stop());
    });

    // hue.groups.findById(1).then(group => {
    //     group.raw({
    //         transitiontime: 20,
    //         bri_inc: -254
    //     });

    //     setTimeout(() => {
    //         group.raw({
    //             bri_inc: 0
    //         });
    //     }, 2000)
    // })
    // console.log(hue.groups._groups);
});

hue.on('error', (msg) => {
    setTimeout(() => {
        hue._attachBridge();
    }, 30*1000);
    console.log('reattaching bridge in 30 seconds');
    console.log('error:', msg);
});
