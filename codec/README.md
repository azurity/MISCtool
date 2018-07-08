# 编解码器的规范

应提供如下函数：

```ts
function encode(data: Buffer, args: { [propName: string]: any }): Buffer
```
- `data`为输入的数据
- 返回值:编码后的数据

```ts
function decode(data: Buffer, args: { [propName: string]: any }): Buffer
```
- `data`为输入的数据
- 返回值:解码后的数据