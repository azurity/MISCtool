const path = require('path')
const fs = require('fs')
const zlib = require('zlib')
const pngParse = require('./pngParse')

function filter(filePath) {
    file = filePath
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            let weight = headerTest(data, new Buffer('89504e470d0a1a0a', 'hex'))
            if (data.slice(12, 16).toString() != 'IHDR') {
                console.log(data.slice(12, 16))
                weight = 10
            }
            resolve({ name: 'png', weight: 10 - weight })
        })
    })
    //
}

var file = ''

function action(argv, start) {
    let data = fs.readFileSync(file)
    headerTest(data, new Buffer('89504e470d0a1a0a', 'hex'))
    let pnginfo = pngParse.parse(data)
    if (pnginfo[pnginfo.length - 1].type == 'IEND') {
        if (pnginfo[pnginfo.length - 1].length > 0) {
            pnginfo[pnginfo.length - 1].redundancy = 'in'
        }
    }
    let index = 0
    for (let it of pnginfo) {
        console.log(`index:${('    ' + index).substr(-3)},chunk:${it.type},length:${('        ' + it.length).substr(-8)},redundancy:${it.redundancy},error:${it.err}`)
        index++
    }
    if (argv.length == start || argv[start] == 'info') {
        return
    }
    if (argv[start] == 'crc') {
        console.log('all crc:')
        let hexstr = ''
        let ascbuf = new Buffer('')
        for (let it of pnginfo) {
            if (it.err == 'crc') {
                hexstr += it.crc.toString('hex').bgRed
            } else {
                hexstr += it.crc.toString('hex')
            }
            ascbuf += it.crc
        }
        console.log('<hex>:' + hexstr)
        console.log('<asc>:' + ascbuf.toString('utf-8'))
        return
    }
    if (argv[start] == 'redundancy') {
        let index = 0
        if (argv.length > start + 1) {
            index = parseInt(argv[start + 1])
        }
        let outFile = 'temp/out-png-redundancy'
        if (argv.length > start + 3 && argv[start + 2] == '-o') {
            outFile = argv[start + 3]
        }
        let item = pnginfo[index]
        if (item.redundancy == 'no') {
            console.warn(`the ${index} chunk have no redundancy.`.bgRed)
            return
        } else if (item.redundancy == 'in') {
            if (item.type == 'IDAT') {
                let isEnd = true
                for (let lid = index + 1; lid < pnginfo.length; i++) {
                    if (pnginfo[lid].type == 'IDAT') {
                        isEnd = false
                        break
                    }
                }
                if (isEnd) {
                    try {
                        let allbuf = new Buffer('')
                        for (let lit of pnginfo) {
                            if (lit.type == 'IDAT') {
                                allbuf += lit.data
                            }
                        }
                        //
                        let unzdata = zlib.inflateSync(allbuf)
                        let size = calcPicSize(pnginfo[0].data)
                        let redbuf = unzdata.slice(size)
                        fs.writeFileSync(path.resolve(outFile), redbuf)
                        console.log(`unzip redundancy data to file at:"${path.resolve(outFile)}"`)
                        return
                    } catch (e) { }
                }
            }
            let redbuf = item.data.slice(length, -4)
            fs.writeFileSync(path.resolve(outFile), redbuf)
            console.log(`out redundancy data to file at:"${path.resolve(outFile)}"`)
            return
        } else if (item.redundancy == 'out') {
            let redbuf = item.data.slice(length + 4)
            fs.writeFileSync(path.resolve(outFile), redbuf)
            console.log(`out redundancy data to file at:"${path.resolve(outFile)}"`)
            return
        }
        return
    }
}

function headerTest(data, header) {
    let count = 0
    for (let i = 0; i < header.length; i++) {
        if (data[i] != header[i]) {
            weight++
            data[i] = header[i]
        }
    }
    return count
}

function calcPicSize(buf) {
    let width = parseInt(buf.slice(0, 4).toString('hex'), 16)
    let height = parseInt(buf.slice(4, 8).toString('hex'), 16)
    let bd = parseInt(buf.slice(8, 12).toString('hex'), 16)
    let type = parseInt(buf.slice(12, 16).toString('hex'), 16)
    if (type == 0 || type == 3) {
        bd *= 1
    } else if (type == 4) {
        bd *= 2
    } else if (type == 2) {
        bd *= 3
    } else if (type == 6) {
        bd *= 4
    }
    let line = Math.ceil(width * bd / 8) + 1
    return line * height
}

function help(argv, start) {
    if (argv.length == start) {
        console.log('png plugin help:')
        console.log('this plugin will match the png file.')
        console.log('the default action is show all chunks\' information.')
        console.log('you can use the sub-mode to do the given action.')
        console.log('all sub-mode:')
        console.log('crc')
        console.log('redundancy')
    } else {
        let sub = argv[start]
        if (sub == 'crc') {
            console.log('png plugin crc sub-mode help:')
            console.log('this will show all the crc part of the png.')
            console.log('the crc will show in both Hex mode and ASCII mode.')
            console.log('in hex mode,the wrong crc will show with red bckground.')
        } else if (sub == 'redundancy') {
            console.log('png plugin redundancy sub-mode help:')
            console.log('format:<index> [-o <file-path>]')
            console.log('this will get the redundancy data of <index>.')
            console.log('you can use "-o" to let the data save in given file.')
        } else {
            console.log('unknown sub-mode.')
        }
    }
    return
}

module.exports = {
    filter,
    action,
    help,
}