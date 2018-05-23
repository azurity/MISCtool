# MISCtool

用来打MISC的小工具

## license

GPLv3,详见[LICENSE](LICENSE)

## 快速开始

### 安装

请首先安装`nodejs`

在项目目录执行`npm install`完成安装

部分插件需要在其插件目录下单独运行`npm install`

目前需要单独处理的插件：`zip`

### 使用

使用`node MISCtool.js [options]`指令来使用工具

获取帮助`node MISCtool.js --help`

列举所有可用功能`node MISCtool.js --actions`

`fileAnalysis`获取帮助:`node MISCtool.js file-analysis --help`

各种文件模式获取帮助:`node MISCtool.js file-analysis --help <file-type>`

## 目录结构

- `MISCtool.js`:主文件，从这个文件启动
- `plugin.js`:plugin管理相关代码
- `config.json`:运行时，用于给插件提供配置参数
- `plugins`:插件目录
    - `fileAnalysis`:文件分析插件
    - `binary`:二进制模式插件，需要有`fileAnalysis`存在，作为默认动作出现
    - `deflate`:deflate解压插件，支持`deflate-raw`,`zlib`,`gzip`，需要有`fileAnalysis`存在
    - `zip`:zip解压插件，需要在其目录下运行`npm install`完成插件安装，需要有`fileAnalysis`存在
    - `png`:[*尚未完成*]png分析插件，需要有`fileAnalysis`存在
- `temp`:运行时的文件默认使出目录和缓存文件目录

## 插件开发

详见`plugins`目录下的[README](plugins/README.md)

欢迎大家PR，提供代码改进和更多的plugin