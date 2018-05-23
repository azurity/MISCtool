const path = require('path')
const fs = require('fs')
const child_process = require('child_process')
const fstream = require('./node_modules/fstream')
const unzip = require('./node_modules/unzip')

function filter(filePath) {
    file = filePath
    let buf = fs.readFileSync(filePath)
    let weight = 0
    if (buf[0] != 0x50) {
        buf[0] = 0x50
        weight += 2
    }
    if (buf[1] != 0x4b) {
        buf[1] = 0x4b
        weight += 2
    }
    if (buf[2] != 0x03) {
        buf[2] = 0x03
        weight += 2
    }
    if (buf[3] != 0x04) {
        buf[3] = 0x04
        weight += 2
    }
    fs.writeFileSync(path.resolve('temp/temp-zip'), buf)
    if (weight == 8) {
        return Promise.resolve({ name: 'zip', weight: 0 })
    }
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.resolve('temp/temp-zip')).pipe(unzip.Parse()).on('error', (error) => {
            console.log(error)
            resolve({ name: 'zip', weight: 0 })
        }).on('finish', () => {
            resolve({ name: 'zip', weight: 10 - weight })
        })
    })
}

var file = ''

function action(argv, start) {
    let buf = fs.readFileSync(path.resolve('temp/temp-zip'))
    if (buf[buf.length - 2] != 0x50 || buf[buf.length - 1] != 0x4b) {
        console.log("There maybe not visible redundant information at the end of the file.".bgWhite.black)
    }
    //
    if (argv.length >= start + 1 && argv[start] == '-o') {
        let outFilePath = ''
        if (argv.length >= start + 2) {
            outFilePath = argv[start + 1]
        }
        outFilePath = 'temp/out-zip'
        try {
            fs.accessSync(path.resolve(outFilePath), fs.constants.F_OK)
            console.log('folder already exist.'.bgRed)
            return
        } catch (e) { }
        fs.mkdirSync(outFilePath)
        fs.createReadStream(path.resolve('temp/temp-zip')).pipe(unzip.Parse()).on('error', (error) => {
            console.error(String(error).bgRed)
        }).on('finish', () => {
            console.log('Sucess unzip the file.')
        }).pipe(fstream.Writer(outFilePath))
    }
}

function help(argv, start) {
    console.log('zip plugin help:')
    console.log('this plugin will match the zip file.')
    console.log('then it will unzip the file.')
    console.log('you can use "-o <folder-path>" to set the unzip aim folder.')
    return
}

module.exports = {
    filter,
    action,
    help,
}