/// <refrence path='fileAnalysis.d.ts' />
const path = require('path')

function init(folderPath) {
    registerFilter('zip', path.resolve(folderPath, 'zip/filter.js'))
}

module.exports = {
    init,
}