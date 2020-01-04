require('dotenv').config();
const Hue = require('./hue');
const Button = require('./gpio/button');
const mapping = require('./light-mapping');

const hue = new Hue(process.env.HUE_USER);

hue.on('ready', () => {
    console.log('ready');

    mapping.forEach(async conf => {
        const group = await hue.groups.findById(conf.to.index);
        const button = new Button(conf.from);

        button.on('rising', _ => console.log('rising'));
        button.on('falling', _ => console.log('falling'));

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
    console.log('error:', msg);
});
