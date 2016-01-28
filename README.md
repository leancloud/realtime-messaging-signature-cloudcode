# LeanCloud 实时通信云代码签名 Demo

LeanCloud 的实时通信服务采用签名方式和用户系统对接，当客户端进行涉及权限、认证相关的操作时，客户端需要首先向用户系统发起请求获得一个签名，再把签名发送到 LeanCloud 实时通信服务，从而帮助 LeanCloud 确认请求是否有效。其机制与 OAuth 1.0 类似。目前签名使用 Hmac + sha1 算法，十六进制输出，签名的 key 为应用的 Master Key，签名内容按请求不同而各异。更多细节请[参考实时通信文档](https://cn.avoscloud.com/docs/realtime.html#%E6%9D%83%E9%99%90%E5%92%8C%E8%AE%A4%E8%AF%81)。

本 demo 仅仅演示签名，并不包含实际业务逻辑。实际应用里你需要根据业务做
相应的检查。这个 demo 同时包含了 [web hosting](https://cn.avoscloud.com/docs/cloud_code_guide.html#web-hosting) 和
[云函数（cloud function）](https://cn.avoscloud.com/docs/cloud_code_guide.html#cloud-%E5%87%BD%E6%95%B0)
两种签名的方式，你可以根据自己的需要选择实现方式。一般来说，云函数部署
方便，参数以 json 文档格式 POST 到服务；而 Web Hosting 提供更灵活的接
口。

你可以通过[云代码命令行工
具](https://cn.avoscloud.com/docs/cloud_code_commandline.html)在本地运
行这个项目

## Web Hosting

通过 web hosting，你可以直接编写服务器端 http 接口，绑定域名后访问。

### POST /sign2

用于实时通信的所有签名。发送的 Content-Type 设置为 `application/json`，请求的 body 是一个 json 对象。

#### Session Open

发送参数：

```
{client_id: ...}
```

#### 创建 Conversation

发送参数：

```
{client_id: ...,
 members: [...]}
```

#### 向 Conversation 添加成员

发送参数：

```
{client_id: ...,
 members: [...],
 conv_id: ...,
 action: 'invite'}
```

#### 从 Conversation 中删除成员

发送参数：

```
{client_id: ...,
 members: [...],
 conv_id: ...,
 action: 'kick'}
```

## 云函数

在开发环境可以通过 avoscloud 命令行工具启动服务后，打开
http://localhost:3000/avos 通过 UI 测试云函数。

在生产环境的调用方法请
[参考文档](https://cn.avoscloud.com/docs/cloud_code_guide.html#%E8%B0%83%E7%94%A8%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0)
。**注意云函数的调用，参数是通过 json 文档的形式传递的**。

### sign2

说明见 web hosting 部分相应的内容。

详情请参考[实时通信云代码集成文档](https://leancloud.cn/docs/realtime.html#%E4%BA%91%E4%BB%A3%E7%A0%81-hook)。

## Contact

* [sunng87](https://github.com/sunng87) nsun@leancloud.rocks
