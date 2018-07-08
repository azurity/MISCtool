const buffer = require('buffer')

function encode(data) {
    return buffer.transcode(data, 'utf8', 'utf16le')
}

function decode(data) {
    return buffer.transcode(data, 'utf16le', 'utf8')
}

module.exports = {
    encode,
    decode
}