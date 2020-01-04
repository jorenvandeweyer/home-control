const connections = require('./connection');

module.exports = async () => {
    try {
        const APIResult = await connections.request({
            url: '/',
            method: 'GET',
        });

        if (checkError(APIResult)) return null;

        return APIResult;
    } catch (e) {
        console.log('error', e);
        return null;
    }
};

function checkError(data) {
    if (!data) return true;

    const elem = data[0];
    if (!elem) return false;

    if (elem.error && elem.error.description === 'unauthorized user')
        return true;

    return false;
}
