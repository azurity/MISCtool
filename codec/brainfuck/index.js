const brainfuck = require('./brainfuck.js')

function encode(data) {
    throw ('now we can\'t encode to brainfuck')
}

function decode(data) {
    return Buffer.from(brainfuck(data.toString('utf8'), ''))
}

module.exports = {
    encode,
    decode
}