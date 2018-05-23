function parse(buffer) {
    //let buffer = new Buffer()
    buffer = buffer.slice(8)
    let info = []
    while (true) {
        if (buffer.length < 12) {
            info.push({ type: 'other', length: 0, redundancy: 'out', err: '', crc: null, crcc: null, data: Buffer.from(buffer) })
            break
        }
        let length = 0
        for (let i = 0; i < 4; i++) {
            length *= 256
            length += buffer[i]
        }
        let type = buffer.toString('ascii', 4, 8)
        if (!isType(type)) {
            info.push({ type: 'other', length: 0, redundancy: 'no', err: 'error-type', crc: null, crcc: null, data: null })
            break
        }
        let next = searchNext(buffer.slice(length + 16))
        if (next == -1) {
            let redundancy
            let err = ''
            let crcc
            let crccin = crcCalc(buffer.slice(4, -4))
            let crccout = crcCalc(buffer.slice(4, length + 8))
            let crcin = parseInt(buffer.slice(-4).toString('hex'), 16)
            let crcout = parseInt(buffer.slice(length + 8, length + 12).toString('hex'), 16)
            if (crccin == crcin) {
                redundancy = 'in'
                crcc = crccin
            } else if (crccout == crcout) {
                redundancy = 'out'
                crcc = crccout
            } else {
                err = 'crc'
            }
            if (buffer.length == length + 12) {
                redundancy = 'no'
            }
            info.push({ type, length, redundancy, err, crc: Buffer.from(buffer.slice(-4)), crcc, data: Buffer.from(buffer.slice(8, -4)) })
            break
        } else if (next == 0) {
            let err = ''
            let crcc = crcCalc(buffer.slice(4, length + 8))
            let crc = parseInt(buffer.slice(length + 8, length + 12).toString('hex'), 16)
            if (crcc != crc) {
                err = 'crc'
            }
            info.push({ type, length, redundancy: 'no', err, crc: Buffer.from(buffer.slice(length + 8, length + 12)), crcc, data: Buffer.from(buffer.slice(8, length + 8)) })
            buffer = buffer.slice(length + 12)
        } else {
            let redundancy
            let err = ''
            let crcc
            let crccin = crcCalc(buffer.slice(4, next + length + 8))
            let crccout = crcCalc(buffer.slice(4, length + 8))
            let crcin = parseInt(buffer.slice(next + length + 8, next + length + 12).toString('hex'), 16)
            let crcout = parseInt(buffer.slice(length + 8, length + 12).toString('hex'), 16)
            if (crccin == crcin) {
                redundancy = 'in'
                crcc = crccin
            } else if (crccout == crcout) {
                redundancy = 'out'
                crcc = crccout
            } else {
                err = 'crc'
            }
            info.push({ type, length, redundancy, err, crc: Buffer.from(buffer.slice(length + 8, length + 12)), crcc, data: Buffer.from(buffer.slice(8, next + length + 8)) })
            buffer = buffer.slice(next + length + 12)
        }
    }
    return info
}

const types = ['IHDR', 'PLTE', 'IDAT', 'IEND', 'cHRM', 'gAMA', 'iCCP', 'sBIT', 'sRGB', 'bKGD', 'hIST', 'tRNS', 'pHYs', 'sPLT', 'tIME', 'iTXt', 'tEXt', 'zTXt']

function isType(str) {
    for (let type of types) {
        if (str == type) {
            return true
        }
    }
    return false
}

function searchNext(buffer) {
    let index = []
    for (let type of types) {
        let lid = buffer.indexOf(type)
        if (lid >= 0) {
            index.push(lid)
        }
    }
    if (index.length > 0) {
        index.sort()
        return index[0]
    }
    return -1
}

const crcTable = new Uint32Array(256)

function createCrcTable() {
    for (let n = 0; n < 256; n++) {
        let c = n
        for (let k = 0; k < 8; k++) {
            if (c & 1 == 1) {
                c = 0xedb88320 ^ (c >>> 1)
            } else {
                c = c >>> 1
            }
        }
        crcTable[n] = c
    }
}
/*
void make_crc_table(void)
{
    unsigned long c;
    int n, k;

    for (n = 0; n < 256; n++) {
    c = (unsigned long) n;
        for (k = 0; k < 8; k++) {
            if (c & 1)
                c = 0xedb88320L ^ (c >> 1);
            else
                c = c >> 1;
        }
        crc_table[n] = c;
    }
    crc_table_computed = 1;
}
*/

function crcCalc(data) {
    if (crcTable[1] == 0) {
        createCrcTable()
    }
    let c = 0xffffffff
    for (let n = 0; n < data.length; n++) {
        c = crcTable[(c ^ data[n]) & 0xff] ^ (c >>> 8)
    }
    return (c ^ 0xffffffff) >>> 0
}
/*
unsigned long update_crc(unsigned long crc, unsigned char *buf, int len)
{
    unsigned long c = crc;
    int n;
  
    if (!crc_table_computed)
        make_crc_table();
    for (n = 0; n < len; n++) {
        c = crc_table[(c ^ buf[n]) & 0xff] ^ (c >> 8);
    }
    return c;
}
*/

module.exports = {
    parse,
}