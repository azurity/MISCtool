const brainfuck = require('../brainfuck.js')
const ook = require('../ook.js')

function encode(data) {
    throw ('now we can\'t encode to Ook')
}

function decode(data) {
    return Buffer.from(brainfuck(ook(data.toString('utf8')), ''))
}

module.exports = {
    encode,
    decode
}