const zlib = require('zlib')
const fs = require('fs')

function tryParse(input, output, args, forceRet) {
    return new Promise((resolve, reject) => {
        fs.readFile(input, (err, data) => {
            var headerErr = ''
            if (err) {
                reject()
            } else {
                if (data.length < 3) {
                    resolve('zlib: can\'t match'.bgRed)
                } else {
                    if (data[0] != 0x1F || data[1] != 0x8B || data[2] != 0x08) {
                        headerErr = ('\ngzip header has some error, the header is: ' + data.subarray(0, 3).toString('hex')).bgRed
                    }
                    data[0] = 0x1F
                    data[1] = 0x8B
                    data[2] = 0x08
                }
                zlib.gunzip(data, (error, result) => {
                    if (error) {
                        if (forceRet) {
                            resolve('gzip: can\'t match'.bgRed)
                        } else {
                            resolve()
                        }
                    } else {
                        if (output != '') {
                            fs.writeFile(output + '-gzip', result, (err) => {
                                if (err) {
                                    resolve('gzip: write to file error'.bgRed + headerErr)
                                } else {
                                    resolve('file is gzip format, write to the aim file' + headerErr)
                                }
                            })
                        } else {
                            resolve('gzip result:\n' + result.toString('hex'))
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