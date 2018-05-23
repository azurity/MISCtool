/// <refrence path='fileAnalysis.d.ts' />
const path = require('path')

function init(folderPath) {
    registerFilter('deflate', path.resolve(folderPath, 'deflate/filter-raw.js'))
    registerFilter('zlib', path.resolve(folderPath, 'deflate/filter-zlib.js'))
    registerFilter('gzip', path.resolve(folderPath, 'deflate/filter-gzip.js'))
}

module.exports = {
    init,
}