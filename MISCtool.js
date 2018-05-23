const path = require('path')
const fs = require('fs')
const colors = require('colors')
const plugin = require('./plugin')

function main(argv, start) {
    try {
        fs.mkdirSync('./temp')
    } catch (e) { }
    let info = false
    if (argv[start] == '--info') {
        info = true
    }
    let pluginInfos = plugin.loadPlugins(path.resolve('./plugins'), info)
    if (info) {
        for (let item of pluginInfos) {
            console.log(`plugin:${plugin.name},\t\tpath:${plugin.path}`)
        }
        process.exit()
    }
    if (argv[start] == '--actions') {
        for (let item of plugin.actions) {
            console.log(item.name)
        }
        return
    }
    if (argv[start] == '--help') {
        console.log('MISCtool help:')
        console.log('this tool is for CTF MISC questions.')
        console.log('you can you this to test some general hidden information.')
        console.log('to list all modules,use "--info"')
        console.log('to list all usable action,use "--actions"')
        return
    }
    for (let action of plugin.actions) {
        if (action.name == argv[start]) {
            if (typeof (action.module.action) == 'function') {
                action.module.action(argv, start + 1, plugin.getMod(action.name))
            }
            break
        }
    }
    return
}

global.config = JSON.parse(fs.readFileSync('./config.json'))

main(process.argv, 2)