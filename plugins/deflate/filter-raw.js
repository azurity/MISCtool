const path = require('path')
const fs = require('fs')
const zlib = require('zlib')

function filter(filePath) {
    file = filePath
    return new Promise((resolve, reject) => {
        zlib.inflateRaw(fs.readFileSync(filePath), (error) => {
            if (error) {
                resolve({ name: 'deflate', weight: 0 })
            } else {
                resolve({ name: 'deflate', weight: 10 })
            }
        })
    })
}

var file = ''

function action(argv, start) {
    let outFilePath = 'temp/out-deflate'
    if (argv.length >= start + 2 && argv[start] == '-o') {
        outFilePath = argv[start + 1]
    }
    zlib.inflateRaw(fs.readFileSync(file), (error, result) => {
        if (error) {
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
    console.log('deflate plugin help:')
    console.log('this plugin will match the raw deflate file.')
    console.log('then it will unzip the file.')
    console.log('you can use "-o <file-path>" to set the unzip aim file.')
    return
}

module.exports = {
    filter,
    action,
    help,
}