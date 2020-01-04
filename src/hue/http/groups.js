const connection = require('./connection');

module.exports = {
    fetchAll: () => {
        return connection.request({
            method: 'GET',
            url: '/groups'
        });
    },
    fetch: (id) => {
        return connection.request({
            method: 'GET',
            url: `/groups/${id}`
        });
    },
    setState: (id, body) => {
        return connection.request({
            method: 'PUT',
            url: `/groups/${id}/action`,
            data: body,
        });
    }
}
