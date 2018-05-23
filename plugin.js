const path = require('path')
const fs = require('fs')

function loadPlugins(folderPath, info) {
    let pluginInfos = []
    let pluginNameList = fs.readdirSync(folderPath)
    for (var item of pluginNameList) {
        var plugin = { name: item, path: '', module: null }
        var pluginPath = path.resolve(folderPath, item)
        plugin.path = pluginPath
        pluginInfos.push(plugin)
    }
    if (info) {
        return pluginInfos
    }
    for (let plugin of pluginInfos) {
        plugin.module = require(path.resolve(plugin.path, 'init.js'))
        if (typeof (plugin.module.preinit) == 'function') {
            plugin.module.preinit(folderPath)
        }
    }
    for (let plugin of pluginInfos) {
        if (typeof (plugin.module.init) == 'function') {
            plugin.module.init(folderPath)
        }
    }
    for (let plugin of pluginInfos) {
        if (typeof (plugin.module.proinit) == 'function') {
            plugin.module.proinit(folderPath)
        }
    }
}

function getMod(name) {
    for (let mod of mods) {
        if (mod.name == name) {
            return mod.obj
        }
    }
    return null
}

const actions = []
const mods = []

global.registerAction = (name, file) => {
    if (typeof (name) == 'string' && typeof (file) == 'string' && name != '' && file != '') {
        actions.push({ name, module: require(file) })
    }
}

global.registerMod = (name, obj) => {
    mods.push({ name, obj })
}

module.exports = {
    loadPlugins,
    getMod,
    actions,
}