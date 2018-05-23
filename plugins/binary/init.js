/// <refrence path='fileAnalysis.d.ts' />
const path = require('path')

function init(folderPath) {
    registerFilter('binary', path.resolve(folderPath, 'binary/filter.js'))
}

module.exports = {
    init,
}