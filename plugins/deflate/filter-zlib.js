const path = require('path')
const fs = require('fs')
const zlib = require('zlib')

function filter(filePath) {
    file = filePath
    let buf = fs.readFileSync(filePath)
    let weight = 0
    if (buf[0] != 0x78) {
        buf[0] = 0x78
        weight += 3
    }
    if (buf[1] != 0x9c) {
        buf[1] = 0x9c
        weight += 3
    }
    return new Promise((resolve, reject) => {
        zlib.inflate(buf, (error) => {
            if (error) {
                resolve({ name: 'zlib', weight: 0 })
            } else {
                resolve({ name: 'zlib', weight: 10 - weight })
            }
        })
    })
}

var file = ''

function action(argv, start) {
    let outFilePath = 'temp/out-zlib'
    if (argv.length >= start + 2 && argv[start] == '-o') {
        outFilePath = argv[start + 1]
    }
    let buf = fs.readFileSync(file)
    buf[0] = 0x78
    buf[1] = 0x9c
    zlib.inflate(buf, (error, result) => {
        if (error) {
            console.log(error)
            console.error(String(error).bgRed)
        } else {
            fs.writeFile(path.resolve(outFilePath), result, (err) => {
                if (!err) {
                    console.log(`out to file at:"${path.resolve(outFilePath)}"`)
                }
            })
        }
    })
    return
}

function help(argv, start) {
    console.log('zlib plugin help:')
    console.log('this plugin will match the zlib file.')
    console.log('then it will unzip the file.')
    console.log('you can use "-o <file-path>" to set the unzip aim file.')
    return
}

module.exports = {
    filter,
    action,
    help,
}