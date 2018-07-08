
function encode(data) {
    let baseEn = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '2', '3', '4', '5', '6', '7']
    let str = ''
    let padding = data.length % 5
    let pdata = Buffer.alloc(data.length + padding, data)
    for (let i = 0; i < padding; i++) {
        pdata[data.length + i] = 0
    }
    for (let i = 0; i < pdata.length; i += 5) {
        //11111222|22333334|44445555|56666677|77788888
        str += baseEn[pdata[i] >>> 3]
        str += baseEn[((pdata[i] & 0x07) << 2) + (pdata[i + 1] >>> 6)]
        str += baseEn[(pdata[i + 1] >>> 1) & 0x1f]
        str += baseEn[((pdata[i + 1] & 0x01) << 4) + (pdata[i + 2] >>> 4)]
        str += baseEn[((pdata[i + 2] & 0x0f) << 1) + (pdata[i + 3] >>> 7)]
        str += baseEn[(pdata[i + 3] >>> 2) & 0x1f]
        str += baseEn[((pdata[i + 3] & 0x03) << 3) + (pdata[i + 4] >>> 5)]
        str += baseEn[pdata[i + 4] & 0x1f]
    }
    let trans = [0, 6, 4, 3, 1]
    padding = trans[padding]
    str = str.substr(0, str.length - padding)
    for (let i = padding; i > 0; i--) {
        str += '='
    }
    return Buffer.from(str, 'utf8')
}

function decode(data) {
    let baseEn = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '2', '3', '4', '5', '6', '7']
    let baseDe = { '=': 0 }
    for (let i = 0; i < baseEn.length; i++) {
        baseDe[baseEn[i]] = i
    }
    let str = data.toString('utf8')
    str = str.toUpperCase()
    for (let i = 0; i < str.length % 8; i++) {
        str += '='
    }
    if (str.match(/[^A-Z2-7=]/)) {
        throw ('unknown character of base32')
    }
    let retArr = []
    for (let i = 0; i < str.length; i += 8) {
        //11111|11122|22222|23333|33334|44444|44555|55555
        retArr.push((baseDe[str[i]] << 3) + (baseDe[str[i + 1]] >>> 2))
        retArr.push(((baseDe[str[i + 1]] & 0x03) << 6) + (baseDe[str[i + 2]] << 1) + (baseDe[str[i + 3]] >>> 4))
        retArr.push(((baseDe[str[i + 3]] & 0x0f) << 4) + (baseDe[str[i + 4]] >>> 1))
        retArr.push(((baseDe[str[i + 4]] & 0x01) << 7) + (baseDe[str[i + 5]] << 2) + (baseDe[str[i + 6]] >>> 3))
        retArr.push(((baseDe[str[i + 6]] & 0x07) << 5) + baseDe[str[i + 7]])
    }
    if (str[str.length - 6] == '=') {
        retArr = retArr.slice(0, - 4)
    } else if (str[str.length - 4] == '=') {
        retArr = retArr.slice(0, - 3)
    } else if (str[str.length - 3] == '=') {
        retArr = retArr.slice(0, - 2)
    } else if (str[str.length - 1] == '=') {
        retArr = retArr.slice(0, - 1)
    }
    let retBuf = Buffer.alloc(retArr.length)
    for (let i = 0; i < retArr.length; i++) {
        retBuf[i] = retArr[i]
    }
    return retBuf
}

module.exports = {
    encode,
    decode
}