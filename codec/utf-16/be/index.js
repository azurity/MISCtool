const buffer = require('buffer')

function encode(data) {
    let str = buffer.transcode(data, 'utf8', 'utf16le')
    for (let i = 0; i < str.length; i += 2) {
        let ld = str[i]
        str[i] = str[i + 1]
        str[i + 1] = ld
    }
    return str
}

function decode(data) {
    for (let i = 0; i < data.length; i += 2) {
        let ld = data[i]
        data[i] = data[i + 1]
        data[i + 1] = ld
    }
    return buffer.transcode(data, 'utf16le', 'utf8')
}

module.exports = {
    encode,
    decode
}