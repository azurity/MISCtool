function ascii85() {
    var base = []
    for (let i = 0; i < 85; i++) {
        base.push(String.fromCharCode(33 + i))
    }
    return base
}

function btoa85() {
    var base = []
    for (let i = 0; i < 85; i++) {
        base.push(String.fromCharCode(32 + i))
    }
    return base
}

function Z85() {
    return [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', '.', '-', ':', '+', '=', '^', '!', '/',
        '*', '?', '&', '<', '>', '(', ')', '[', ']', '{',
        '}', '@', '%', '$', '#']
}

function encode(data, args) {
    let baseEn = []
    if (args['type'] == 'ascii85') {
        baseEn = ascii85()
    } else if (args['type'] == 'btoa') {
        baseEn = btoa85()
    } else if (args['type'] == 'adobe') {
        baseEn = ascii85()
    } else if (args['type'] == 'Z85') {
        baseEn = Z85()
    } else {
        baseEn = ascii85()
    }
    let str = ''
    let padding = data.length % 4
    let pdata = Buffer.alloc(data.length + padding, data)
    for (let i = 0; i < pdata.length; i += 4) {
        let num = pdata.readUInt32BE(i)
        if (num == 0) {
            str += 'z'
            continue
        }
        if (args['type'] == 'btoa' && num == 0x20202020) {
            str += 'y'
            continue
        }
        let lstr = ''
        for (let j = 0; j < 5; j++) {
            lstr = baseEn[num % 85] + lstr
            num = parseInt(num / 85)
        }
        str += lstr
    }
    str = str.substr(0, str.length - padding)
    if (args['type'] == 'btoa') {
        str = 'xbtoa Begin' + str + 'xbtoa End'
    } else if (args['type'] == 'adobe') {
        str = '<~' + str + '~>'
    }
    return Buffer.from(str, 'utf8')
}

function decode(data, args) {
    let str = data.toString('utf8')
    let baseEn = []
    if (args['type'] == 'ascii85') {
        baseEn = ascii85()
    } else if (args['type'] == 'btoa') {
        baseEn = btoa85()
        if (!str.match(/^xbtoa Begin/) || !str.match(/xbtoa End$/)) {
            throw ('error begin or end of btoa85')
        }
        str = str.substr(11, str.length - 20)
        str = str.replace(/y/g, '*;UcK')
    } else if (args['type'] == 'adobe') {
        baseEn = ascii85()
        if (!str.match(/^<~/) || !str.match(/~>$/)) {
            throw ('error begin or end of Adobe85')
        }
        str = str.substr(2, str.length - 4)
    } else if (args['type'] == 'Z85') {
        baseEn = Z85()
    }
    str = str.replace(/z/g, new Array(6).join(baseEn[0]))
    let baseDe = {}
    for (let i = 0; i < 85; i++) {
        baseDe[baseEn[i]] = i
    }
    let padding = str.length % 5
    if (padding == 4) {
        throw ('error length of base85')
    }
    str += new Array(padding).join(baseEn[84])
    let retData = Buffer.alloc(str.length / 5 * 4)
    for (let i = 0; i < str.length; i += 5) {
        let num = baseDe[str[i]] * 85 * 85 * 85 * 85 + baseDe[str[i + 1]] * 85 * 85 * 85 + baseDe[str[i + 2]] * 85 * 85 + baseDe[str[i + 3]] * 85 + baseDe[str[i + 4]]
        retData.writeUInt32BE(num, i / 5 * 4)
    }
    return retData.slice(0, retData.length - padding)
}

module.exports = {
    encode,
    decode
}