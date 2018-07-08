const caesar = require('../index.js')

function encode(data) {
    return caesar.encode(data, { count: 13 })
}

function decode(data) {
    return caesar.decode(data, { count: 13 })
}

module.exports = {
    encode,
    decode
}