function encode(data) {
    return Buffer.from(encodeURI(data.toString('utf8')))
}

function decode(data) {
    return Buffer.from(decodeURI(data.toString('utf8')), 'utf8')
}

module.exports = {
    encode,
    decode
}