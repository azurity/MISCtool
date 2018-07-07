const zlib = require('zlib')
const fs = require('fs')

function tryParse(input, output, args, forceRet) {
    return new Promise((resolve, reject) => {
        fs.readFile(input, (err, data) => {
            if (err) {
                reject()
            } else {
                zlib.inflateRaw(data, (error, result) => {
                    if (error) {
                        if (forceRet) {
                            resolve('zlib-raw: can\'t match'.bgRed)
                        } else {
                            resolve()
                        }
                    } else {
                        if (output != '') {
                            fs.writeFile(output + '-zlibRaw', result, (err) => {
                                if (err) {
                                    console.log('zlib-raw: write to file error'.bgRed)
                                    resolve()
                                }else{
                                    resolve('file is zlib-raw format, write to the aim file')
                                }
                            })
                        } else {
                            resolve('zlib-raw result:\n' + result.toString('hex'))
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