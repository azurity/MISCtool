const lib = require('./jsfuck.js')

function encode(data) {
    return Buffer.from(lib.JSFuck.encode(data.toString('utf8')))
}

function decode(data) {
    return Buffer.from(eval(data.toString('utf8')))
}

module.exports = {
    encode,
    decode
}