function encode(data, args) {
    let key = parseInt(args.count)
    for (let i = 0; i < data.length; i++) {
        data[i] = (data[i] + key) % 256
    }
    return data
}

function decode(data, args) {
    let key = parseInt(args.count)
    for (let i = 0; i < data.length; i++) {
        data[i] = (data[i] - key) % 256
    }
    return data
}

module.exports = {
    encode,
    decode
}