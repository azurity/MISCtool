function encode(data) {
    return Buffer.from(data.toString('base64'))
}

function decode(data) {
    let str = data.toString('utf8')
    if (str.match(/[^A-Za-z0-9+/=]/)) {
        throw ('illegal base64 data'.bgRed)
    }
    return Buffer.from(str, 'base64')
}

module.exports = {
    encode,
    decode
}