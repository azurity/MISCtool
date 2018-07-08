const colors = require('colors')
const process = require('process')
var program = require('commander')
const fs = require('fs')
const path = require('path')

program.input = ''
program.output = ''
program.codec = []

function keyval(val) {
    var ret = {}
    let l = val.split(',')
    for (let it of l) {
        let pair = it.split(':')
        ret[pair[0]] = pair[1]
    }
    return ret
}

function list(val) {
    return val.split(',')
}

program.version('1.0.0')
    .usage('[options] <plugin-args>')
    .option('-c, --codec <codecs>', 'set the order of use codec, use -e/-d suffix to distinguish encoding and decoding, if use arguments please use as `(key:value,...)`', list)
    .option('-i, --input <path>', 'give a path for processing')
    .option('-l, --list-codecs', 'list all codecs supported')
    .option('-o, --output <path>', 'give an output path')
    .option('-I, --input-data <data>', 'give input data')
    .parse(process.argv)

var allCodecs = JSON.parse(fs.readFileSync('codec.json'), { encoding: 'utf8' })

var codecObj = {}

if (program.listCodecs) {
    for (let it of allCodecs) {
        console.log(it.codec)
    }
    process.exit()
}

for (let it of allCodecs) {
    codecObj[it.codec] = require(path.resolve(it.path, 'index.js'))
}

if (program.input != '') {
    try {
        program.inputData = fs.readFileSync(path.resolve(program.path))
    } catch (e) {
        console.log('can\'t read from file: %s'.bgRed, program.input)
        process.exit()
    }
}

var data = Buffer.from(program.inputData, 'utf8')

try {
    for (let it of program.codec) {
        let argStr = it.match(/\(.*\)/)
        if (argStr != null) {
            argStr = argStr.toString()
        } else {
            argStr = ''
        }
        let name = it.substr(0, it.length - argStr.length - 2)
        if (typeof codecObj[name] == 'undefined') {
            console.log('no such codec: %s'.bgRed, name)
            process.exit()
        }
        if(argStr[0]=='('){
            argStr=argStr.substr(1, argStr.length - 2)
        }
        let argv = keyval(argStr)
        if (it.substr(-2) == '-e') {
            data = codecObj[name].encode(data, argv)
        } else if (it.substr(-2) == '-d') {
            data = codecObj[name].decode(data, argv)
        }
    }
} catch (e) {
    console.log(e)
    process.exit()
}

if (program.output != '') {
    try {
        fs.writeFileSync(path.resolve(program.output), data)
        console.log('data write to file: %s', program.output)
        process.exit()
    } catch (e) {
        console.log('write to file error')
    }
}

try {
    console.log('utf-8:\n' + data.toString('utf8'))
} catch (e) {
    console.log('can\' show as utf-8.')
}
console.log('hex:\n' + data.toString('hex'))