# 插件开发帮助

插件是用于提供各种功能的模块，MISCtool本质上只是一个插件管理器。

## 初始化阶段

初始化时，将加载模块自己目录下的`init.js`文件，并按照顺序调用`preinit`,`init`,`proinit`函数完成初始化

请提供`init.js`文件，即便模块不需要初始化

可供使用的全局配置参数对象:

```ts
global.config
```
此对象为`config.json`的解析结果

## action类型模块

用于提供主要功能的模块，独立于其他模块的功能(可以不依赖其他模块使用)，直接由MISCtool调用启动

可供使用的全局函数(由MISCtool提供):

```ts
global.registerAction(name: string, file: string): void
```
用于注册action
- `name`:action的名称，将在命令调用时使用
- `file`:功能函数所在文件，将被加载并调用

```ts
global.registerMod(name: string, obj: any): void
```
用于注册模块，以携带附加对象
- `name`:模块名称
- `obj`:需要在被调用模块时传递的对象

action文件(使用函数注册的文件)应提供的函数:

```ts
action(argv: string[], start: number, obj: any): void
```
用于完成模块提供的功能
- `argv`:整个命令行的所有参数
- `start`:命令行中，action所需参数的起始位置，不含action的名称(action的名称可能位于start-1处)
- `obj`:在注册模块时，要求附带的对象

默认提供的action类型模块:

- action名称:`file-analysis`,所在模块`fileAnalysis`

## filter类型模块

用于给`fileAnalysis`提供特定文件类型解析处理的模块，依附于`fileAnalysis`模块使用，由`fileAnalysis`间接调用

可供使用的全局函数(由fileAnalysis提供):

```ts
registerFilter(name: string, file: string): void
```
用于注册filter
- `name`:filter的名称，将在命令调用时使用
- `file`:功能函数所在文件，将被加载并调用

filter文件(使用函数注册的文件)应提供的函数:

```ts
filter(filePath: string): Promise
```
判断所给定文件是否为可以处理的文件类型，请勿依据文件名简单判断
- `filePath`:将要进行判断的文件的全路径
- 返回值:返回的Promise应永远resolve，resolve的结果应为`{name: string, weight: number}`的结构，其中:
    - `name`:当前filter的名称，应与其注册的名称一致
    - `weight`:可以认为是其所需要的文件的可能性，0-10，10为一定是，0为一定不是

```ts
action(argv: string[], start: number): void
```
用于完成对文件的分析
- `argv`:整个命令行的所有参数
- `start`:命令行中，filter所需参数的起始位置，不含filter的名称(filter的名称可能位于start-1处)

```ts
help(argv: string[], start: number): void
```
用于显示帮助信息
- `argv`:整个命令行的所有参数
- `start`:命令行中，冗余参数的起始位置，可能被模块所需要，不含filter的名称(filter的名称可能位于start-1处)

默认提供的action类型模块:

- filter名称:`binary`,所在模块`binary`,永远weight为0，为默认无法处理文件时所使用filter
- filter名称:`deflate`,所在模块`deflate`,匹配deflate-raw数据
- filter名称:`zlib`,所在模块`deflate`,匹配zlib数据
- filter名称:`gzip`,所在模块`deflate`,匹配gzip数据
- filter名称:`zip`,所在模块`zip`,匹配zip数据
- [*尚未完成*]filter名称:`png`,所在模块`png`,匹配png数据