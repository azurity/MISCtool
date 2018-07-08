function encode(data) {
    return Buffer.from(data.toString('hex'))
}

function decode(data) {
    let str = data.toString('utf8')
    if (str.match(/[^0-9A-Fa-f]/)) {
        throw ('illegal hex/base16 data'.bgRed)
    }
    return Buffer.from(str, 'hex')
}

module.exports = {
    encode,
    decode
}