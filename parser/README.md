# 文件格式parser的规范

应提供如下函数：
```ts
function tryParse(input: string, output: string, args: string[], forceRet: boolean): Promise
```
其中：
- `input`为输入文件的地址
- `output`为输出文件的地址，或为空字符串
- `args`为命令行中其他参数
- `forceRet`为是否强制要求promise的执行结果需要返回文字内容
- 返回值:一个用于分析和处理的promise对象