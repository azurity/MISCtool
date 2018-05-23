/// <refrence path='fileAnalysis.d.ts' />
const path = require('path')

function init(folderPath) {
    registerFilter('png', path.resolve(folderPath, 'png/filter.js'))
}

module.exports = {
    init,
}