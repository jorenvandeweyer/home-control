const EventListener = require('events');
const http = require('./http');

const Groups = require('./classes/groups');

module.exports = class extends EventListener{
    constructor(username, _options) {
        super();
        this._username = username;

        this._ipaddress = null;

        this.groups = new Groups();

        this._attachBridge();
    }

    async _attachBridge() {
        try {
            const bridges = await http.bridge.findAll();
            this._ipaddress = bridges[0].internalipaddress;

            await http.connections.create(this._ipaddress, this._username);
            this.fetchAll();
        } catch (e) {
            this.emit('error', e);
        }
    }

    async fetchAll() {
        const APIResult = await http.base();

        if (!APIResult)
            return this.emit('error', 'Not Authenticated');

        await this._create(APIResult);

        return this.emit('ready');
    }

    async _create(object) {
        this.groups._createFromObject(object.groups);
    }

}
