function encode(data) {
    let buf = Buffer.from(data.toString('base64'))
    for (let i = 0; i < buf.length; i++) {
        if (String.fromCharCode(buf[i]).match(/[A-Za-z]/)) {
            buf[i] ^= 0x20
        }
    }
    return buf
}

function decode(data) {
    for (let i = 0; u < buf.length; i++) {
        if (String.fromCharCode(buf[i]).match(/[A-Za-z]/)) {
            buf[i] ^= 0x20
        }
    }
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