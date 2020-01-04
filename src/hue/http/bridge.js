const axios = require('axios');

async function findAll() {
    try {
        const result = await axios.request({
            url: 'https://discovery.meethue.com',
            method: 'GET',
        });

        return result.data;
    } catch(e) {
        return null;
    }
}

async function findOne(id) {
    const bridges = await findAll();

    return bridges.find(bridge => bridge.id === id);
}

module.exports = {
    findAll,
    findOne
}
