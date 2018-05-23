const path = require('path')
const fs = require('fs')

function action(argv, start, filters) {
    if (argv.length == start) {
        console.log('You are in file analysis mode.\nPlease use "--help" to get help infomation.')
        return
    }
    if (argv[start] == '--info') {
        console.log('copyright azurity,MISCtool basic plugin')
        return
    }
    if (argv[start] == '--types') {
        console.log('all types:')
        for (let filter of filters) {
            console.log(filter.name)
        }
        return
    }
    if (argv[start] == '--help') {
        if (argv.length == start + 1) {
            console.log('File Analysis help information.')
            console.log('--types    list all usable file types')
            console.log('command format:\nfile-analysis <file-path> <type> [other-args]')
            console.log('if <type> is "auto",will auto match file type.')
            console.log('to get the help information of given type,use:"--help <type>"')
        } else {
            for (let filter of filters) {
                if (filter.name == argv[start + 1]) {
                    if (typeof (filter.module.help) == 'function') {
                        filter.module.help(argv, start + 2)
                    }
                    break
                }
            }
        }
        return
    }
    let filePath = path.resolve(argv[start])
    try {
        fs.accessSync(filePath, fs.constants.F_OK)
    } catch (e) {
        console.warn('No such file. Please check the file name.'.bgRed)
        return
    }
    try {
        fs.accessSync(filePath, fs.constants.R_OK)
    } catch (e) {
        console.warn('No permission to read the file.'.bgRed)
        return
    }
    //
    let filterType = ''
    if (argv[start + 1] == 'auto' || argv.length == start + 1) {
        let filterPromise = []
        for (let filter of filters) {
            if (typeof (filter.module.filter) == 'function') {
                filterPromise.push(filter.module.filter(filePath))
            }
        }
        Promise.all(filterPromise).then((value) => {
            //console.log(value)
            let filterRet = value.sort((a, b) => { return b.weight - a.weight })
            for (let filter of filterRet) {
                if (filter.weight == 0) break
                if (filter.weight == 10) {
                    console.log(`filter:${(filter.name + '        ').substr(0, 16)},matched`)
                    continue
                }
                console.log(`filter:${(filter.name + '        ').substr(0, 16)},weight:${filter.weight}`)
            }
            if (filterRet[0].weight == 0) {
                console.log('Unmatched.binary default.')
                filterRet = [{ name: 'binary' }, ...filterRet]
            }
            filterType = filterRet[0].name
            //
            for (let filter of filters) {
                if (filter.name == filterType) {
                    if (typeof (filter.module.action) == 'function') {
                        console.log(`type:${filterType}`.bgWhite.black)
                        filter.module.action(argv, start + 2)
                    }
                }
            }
        })
    } else {
        filterType = argv[start + 1]
        console.warn(`I think you know what you're doing.`.bgRed)
        //
        for (let filter of filters) {
            if (filter.name == filterType) {
                if (typeof (filter.module.action) == 'function') {
                    if (typeof (filter.module.filter) == 'function') {
                        filter.module.filter(filePath).then(() => {
                            filter.module.action(argv, start + 2)
                        })
                    } else {
                        filter.module.action(argv, start + 2)
                    }
                }
            }
        }
    }
}

module.exports = {
    action,
}