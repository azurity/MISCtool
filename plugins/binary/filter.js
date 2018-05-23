const path = require('path')
const child_process = require('child_process')

function filter(filePath) {
    file = filePath
    return Promise.resolve({ name: 'binary', weight: 0 })
}

var file = ''

function action(argv, start) {
    if (typeof (config.binary) == 'string') {
        console.log('open file in binary viewer.')
        child_process.execFile(path.resolve(config.binary), [file])
    } else {
        console.log('No binary viewer configuration.')
    }
    return
}

function help(argv, start) {
    console.log('binary plugin help:')
    console.log('this is the default file type.')
    console.log('every unknown file will use this mode.')
    console.log('this mode will open the file by a binary viewer.')
    console.log('you can set the "binary" in "config.json" to use your own binary viewer.')
    return
}

module.exports = {
    filter,
    action,
    help,
}