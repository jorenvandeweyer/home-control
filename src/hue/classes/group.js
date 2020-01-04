const EventListener = require('events');
const http = require('../http');

module.exports = class Group extends EventListener {
    constructor(id, groupObject) {
        super();
        this._id = id;
        this._groupObject = groupObject;
    }

    get isOn() {
        return this._groupObject.action.on;
    }

    get lights() {
        return this._groupObject.lights;
    }

    get name() {
        return this._groupObject.name;
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._groupObject.type;
    }

    async update() {
        this._groupObject = await http.groups.fetch(this._id);
    }

    updateFromObject(groupObject) {
        this._groupObject = groupObject;
    }

    async toggle() {
        await this.update();
        if (this.isOn) await this.off();
        else await this.on();
    }

    async on() {
        return http.groups.setState(this.id, {
            on: true,
        })
    }

    async off() {
        return http.groups.setState(this.id, {
            on: false,
        })
    }
}
