function makeDict(key, value) {
    var ret = {}
    for (let i = 0; i < key.length; i++) {
        ret[key[i]] = value[i]
    }
    return ret
}

var morseChar = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    //'AA','AR','AS','BK','BT','CT','SK','SOS',
    '.', ':', ',', ';', '?', '=', "'", '/', '!', '-', '_', '"', '(', ')', '$', '&', '@', '+'
]
var morseCode = [
    // letter
    '.-', '-...', '-.-.', '-..', '.', '..-.', '--.', '....', '..', '.---', '-.-', '.-..', '--', '-.', '---', '.--.', '--.-', '.-.', '...', '-', '..-', '...-', '.--', '-..-', '-.--', '--..',
    // number 
    '.----', '..---', '...--', '....-', '.....', '-....', '--...', '---..', '----.', '-----',
    // special charactor
    //'.-.-','.-.-.','.-...','-...-.-','-...-','-.-.-','...-.-','...---...',
    // punctuation
    '.-.-.-', '---...', '--..--', '-.-.-.', '..--..', '-...-', '.----.', '-..-.', '-.-.--', '-....-', '..--.-', '.-..-.', '-.--.', '-.--.-', '...-..-', '.-...', '.--.-.', '.-.-.'
]

function encode(data) {
    let morseEn = makeDict(morseChar, morseCode)
    let str = data.toString('utf8')
    str = str.toUpperCase()
    let strRet = ''
    for (let i = 0; i < str.length; i++) {
        if (str.trim() == '') {
            continue
        }
        if (morseEn[str[i]] != null) {
            strRet += morseEn[str[i]] + ' '
        } else {
            throw ('error character try encoding to morse code')
        }
    }
    return Buffer.from(strRet)
}

function decode(data) {
    let morseDe = makeDict(morseCode, morseChar)
    let str = data.toString('utf8').replace(/\//g, ' ')
    let list = str.split(' ')
    var strRet = ''
    for (let i = 0; i < list.length; i++) {
        let lstr = list[i].trim()
        if (lstr == '') {
            continue
        }
        if (morseDe[lstr] != null) {
            strRet += morseDe[lstr]
        } else {
            throw ('error character try decoding form morse code')
        }
    }
    return Buffer.from(strRet)
}

module.exports = {
    encode,
    decode
}