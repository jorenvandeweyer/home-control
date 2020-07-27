const EventListener = require('events');
const Group = require('./group');
const http = require('../http');

module.exports = class Groups extends EventListener {
    constructor(groups) {
        super();

        this._groups = new Map();

        if (groups)
            this._createFromObject(groups);
    }

    async update() {
        const APIResult = await http.groups.getAll();
        if (!APIResult) return;

        Object.entries(APIResult).forEach(this._createFromEntry);
    }

    async findById(id) {
        return this._groups.get(id.toString());
    }

    _createFromEntry(entry) {
        const [id, groupObject] = entry;
        this._groups.set(id, new Group(id, groupObject));
    }

    _createFromObject(object) {
        Object.entries(object).forEach(entry => this._createFromEntry(entry));
    }

    get size() {
        return this._groups.size;
    }
}
