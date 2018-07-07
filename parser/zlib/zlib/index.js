const zlib = require('zlib')
const fs = require('fs')

function tryParse(input, output, args, forceRet) {
    return new Promise((resolve, reject) => {
        fs.readFile(input, (err, data) => {
            var headerErr = ''
            if (err) {
                reject()
            } else {
                if (data.length < 2) {
                    resolve('zlib: can\'t match'.bgRed)
                } else {
                    if (data[0] != 0x78 || (data[0] + data[1]) % 31 != 0) {
                        headerErr = ('\nzlib header has some error, the header is: ' + data.subarray(0, 2).toString('hex')).bgRed
                    }
                    data[0] = 0x78
                    data[1] = 0x9c
                }
                zlib.inflate(data, (error, result) => {
                    if (error) {
                        if (forceRet) {
                            resolve('zlib: can\'t match'.bgRed)
                        } else {
                            resolve()
                        }
                    } else {
                        if (output != '') {
                            fs.writeFile(output + '-zlib', result, (err) => {
                                if (err) {
                                    resolve('zlib: write to file error'.bgRed + headerErr)
                                } else {
                                    resolve('zlib: file is zlib format, write to the aim file' + headerErr)
                                }
                            })
                        } else {
                            resolve('zlib result:\n' + result.toString('hex'))
                        }
                    }
                })
            }
        })
    })
}

module.exports = {
    tryParse
}