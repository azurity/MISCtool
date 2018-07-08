# MISCtool

用来打MISC的小工具

+ 2018-07-06 重置

## license

GPLv3,详见[LICENSE](LICENSE)

## 快速开始

### 安装

请首先安装`nodejs`

在项目目录执行`npm install`完成安装

### 使用

- `file.js`：
    用于提供对文件的分析与处理，需要输入要处理的指定文件，具体使用方式请使用指令`node file.js -h`
- `codec.js`:
    编码处理工具，可在各种编码下转换，默认文字编码为`utf-8`，具体使用方式请使用指令`node codec.js -h`

## 目录结构

- `file.js`:文件分析脚本
- `codec.js`:编码转换脚本
- `file-format.json`:所有可用文件格式分析脚本插件的配置文件
- `codec.json`:所有可用编解码器脚本插件的配置文件
- `parser`:文件格式分析脚本插件目录
    - `zlib`:deflate相关格式分析脚本
        - `gzip/index.js`:gzip格式分析脚本
        - `raw/index.js`:无格式deflate格式分析脚本
        - `zlib/index.js`:zlib格式分析脚本
- `codec`:编解码器脚本插件目录
    - `base32/index.js`:base32编解码器
    - `base64/index.js`:base64编解码器
    - `base64/toggle/index.js`:大小写转换的base64编解码器
    - `base85/index.js`:base85编解码器，支持ascii85,Adobe85,Z85格式
    - `brainfuck`:brainfuck和Ook解码器(暂时不支持编码)
        - `brainfuck.js & Ook.js`:开源解码器，来源未知
        - `index.js`:brainfuck解码器封装
        - `ook/index.js`:Ook解码器封装
    - `caesar/index.js`:字母凯撒加密编解码器
    - `caesar/ascii/index.js`:ASCII凯撒加密编解码器
    - `caesar/rot13/index.js`:rot13编解码器
    - `hex/index.js`:16进制编解码器
    - `jsfuck`:jsfuck相关编解码器
        - `index.js`:jsfuck编解码器封装
        - `jsfuck.js`:开源JSFuck编码器库[jsfuck](https://github.com/aemkei/jsfuck)
    - `morse/index.js`:摩斯密码编解码器
    - `url/index.js`:url编解码器
    - `url/component/index.js`:url组件编解码器
    - `utf-8`:utf-8编解码器(空白编解码器)
    - `utf-16`:utf-16相关编解码器
        - `le/index.js`:utf-16 little-endian编解码器
        - `be/index.js`:utf-16 big-endian编解码器

## 插件开发

详见对应目录下的REDME.md文件

- [parser](parser/README.md)
- [codec](codec/README.md)

欢迎大家PR，提供代码改进和更多的插件