const axios = require('axios');
const https = require('https');

class Connections {
    constructor() {
        this._connections = [];
    }

    get connection() {
        if (!this._connections.length)
            return null;
        
        return this._connections[0];
    }

    get conn() {
        return this.connection;
    }
    
    create(baseURL, username) {
        const connection = axios.create({
            baseURL: `https://${baseURL}/api/${username}`,
            httpsAgent: new https.Agent({  
                rejectUnauthorized: false
            })
        });
        this._connections.push(connection);

        return connection;
    }

    request(options) {
        return this.conn(options)
            .then(res => res.data)
            .catch(e => {
                console.log('error', e);
                return null;
            });
    }
}

const connections = new Connections();

module.exports = connections;
