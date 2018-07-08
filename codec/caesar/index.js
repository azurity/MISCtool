function encode(data, args) {
    let key = parseInt(args.count) % 26
    let str = data.toString('utf8')
    let ret = ''
    for (let i = 0; i < str.length; i++) {
        if (str[i].match(/[A-Z]/)) {
            ret += String.fromCharCode((str.charCodeAt(i) - 65 + key + 26) % 26 + 65)
        } else if (str[i].match(/[a-z]/)) {
            ret += String.fromCharCode((str.charCodeAt(i) - 97 + key + 26) % 26 + 97)
        }
    }
    return Buffer.from(ret, 'utf8')
}

function decode(data, args) {
    let key = parseInt(args.count) % 26
    let str = data.toString('utf8')
    let ret = ''
    for (let i = 0; i < str.length; i++) {
        if (str[i].match(/[A-Z]/)) {
            ret += String.fromCharCode((str.charCodeAt(i) - 65 - key + 26) % 26 + 65)
        } else if (str[i].match(/[a-z]/)) {
            ret += String.fromCharCode((str.charCodeAt(i) - 97 - key + 26) % 26 + 97)
        }
    }
    return Buffer.from(ret, 'utf8')
}

module.exports = {
    encode,
    decode
}