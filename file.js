const colors = require('colors')
const process = require('process')
var program = require('commander')
const fs = require('fs')
const path = require('path')

program.input = ''
program.output = ''
program.format = []

function list(val) {
    return val.split(',')
}

program.version('1.0.0')
    .usage('[options] <plugin-args>')
    .option('-f, --format <file-formats>', 'give the possible formats of your file, `auto` is default', list)
    .option('-i, --input <path>', 'give a path for processing')
    .option('-l, --list-formats', 'list all formats supported')
    .option('-o, --output <path>', 'give an output path')
    .parse(process.argv)

//console.log(program)

var allFormats = JSON.parse(fs.readFileSync('file-format.json', { encoding: 'utf8' }))

if (program.listFormats) {
    for (let it of allFormats) {
        console.log(it.format)
    }
    process.exit()
}

if (program.input == '') {
    console.log('please input a file'.bgRed)
    process.exit()
}

try {
    fs.accessSync(program.input, fs.constants.F_OK)
} catch (e) {
    console.log('no such file: "%s"'.bgRed, program.input)
    process.exit()
}

if (!fs.statSync(program.input).isFile()) {
    console.log('input path is not a file: "%s"'.bgRed, program.input)
    process.exit()
}

try {
    fs.accessSync(program.input, fs.constants.R_OK)
} catch (e) {
    console.log('file can\'t read: "%s"'.bgRed, program.input)
    process.exit()
}

console.log('parsing the file: %s', program.input)

if (program.format.length == 0) {
    var tryparse = []
    for (let it of allFormats) {
        tryparse.push(require(path.resolve(it.path, 'index.js')).tryParse(path.resolve(program.input), program.output, program.args, false))
    }
    Promise.all(tryparse).then(value => {
        if (value.length == 0) {
            console.log('sorry, no format matched'.bgRed)
        } else {
            for (let it of value) {
                if (it != null) {
                    console.log(it)
                }

            }
        }
    })
} else {
    var tryparse = []
    for (let it of allFormats) {
        if (program.format.includes(it.format)) {
            tryparse.push(require(path.resolve(it.path, 'index.js')).tryParse(path.resolve(program.input), program.output, program.args, true))
        }
    }
    Promise.all(tryparse).then(value => {
        for (let it of value) {
            if (it != null) {
                console.log(it)
            }
        }
    })
}