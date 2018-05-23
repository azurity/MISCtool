/// <refrence path='init.d.ts' />
const path = require('path')

function preinit(folderPath) {
    global.registerFilter = (name, file) => {
        if (typeof (name) == 'string' && typeof (file) == 'string' && name != '' && file != '') {
            filters.push({ name, module: require(file) })
        }
    }
}

function init(folderPath) {
    registerAction('file-analysis', path.resolve(folderPath, 'fileAnalysis/action.js'))
}

function proinit(folderPath) {
    registerMod('file-analysis', filters)
}

const filters = []

module.exports = {
    preinit,
    init,
    proinit,
}