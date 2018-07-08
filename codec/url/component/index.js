function encode(data) {
    return Buffer.from(encodeURIComponent(data.toString('utf8')))
}

function decode(data) {
    return Buffer.from(decodeURIComponent(data.toString('utf8')), 'utf8')
}

module.exports = {
    encode,
    decode
}