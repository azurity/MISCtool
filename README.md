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
    - `base64/index.js`:base64编解码器
    - `base64/toggle/index.js`:大小写转换的base64编解码器
    - `hex/index.js`:16进制编解码器
    - `utf-8`:utf-8编解码器(空白编解码器)

## 插件开发

详见对应目录下的REDME.md文件

- [parser](parser/README.md)
- [codec](codec/README.md)

欢迎大家PR，提供代码改进和更多的插件