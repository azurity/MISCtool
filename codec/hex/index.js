function encode(data) {
    return Buffer.from(data.toString('hex'))
}

function decode(data) {
    var str = data.toString('utf8')
    if (str.match(/[^0-9A-Fa-f]/)) {
        throw ('illegal hex data'.bgRed)
    }
    return Buffer.from(str, 'hex')
}

module.exports = {
    encode,
    decode
}