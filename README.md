# LeanCloud 实时通信云引擎签名 Demo

LeanCloud 的实时通信服务采用签名方式和用户系统对接，当客户端进行涉及权限、认证相关的操作时，客户端需要首先向用户系统发起请求获得一个签名，再把签名发送到 LeanCloud 实时通信服务，从而帮助 LeanCloud 确认请求是否有效。其机制与 OAuth 1.0 类似。目前签名使用 Hmac + sha1 算法，十六进制输出，签名的 key 为应用的 Master Key，签名内容按请求不同而各异。更多细节请参考 [实时通信概览 &middot; 权限和认证](https://leancloud.cn/docs/realtime_v2.html#权限和认证)。

本 Demo 仅仅演示签名，并不包含实际业务逻辑。实际应用中你需要根据业务做相应的检查。这个 Demo 同时包含了 [网站托管](https://leancloud.cn/docs/leanengine_webhosting_guide-node.html) 和 
[云函数（cloud function）](https://leancloud.cn/docs/leanengine_cloudfunction_guide-node.html)两种签名的方式，你可以根据自己的需要选择实现方式。一般来说，云函数部署方便，参数以 JSON 文档格式 POST 到服务；而网站托管提供更灵活的接口。

你可以通过 [云引擎命令行工具](https://leancloud.cn/docs/leanengine_cli.html) 在本地运行这个项目：

```
lean up
```

## 网站托管

通过网站托管，你可以直接编写服务器端 http 接口，绑定域名后访问。假设您在本地直接运行，可以通过下面的命令调用（这里使用的命令行 HTTP 客户端是 [httpie](http://httpie.org)）：

```
echo '{"client_id":"123"}' | http post http://localhost:3000/sign2
```

### POST /sign2

用于实时通信的所有签名。发送的 Content-Type 设置为 `application/json`，请求的 body 是一个对象。

#### Session Open

发送参数：

```
{
  client_id: ...
}
```

#### 创建 Conversation

发送参数：

```
{
  client_id: ...,
  members:   [...]
}
```

#### 向 Conversation 添加成员

发送参数：

```
{
  client_id: ...,
  members:   [...],
  conv_id:   ...,
  action:    'invite'
}
```

#### 从 Conversation 中删除成员

发送参数：

```
{
  client_id: ...,
   members:  [...],
   conv_id:  ...,
   action:   'kick'
}
```

## 云函数

在开发环境可以通过 `lean up` 命令行工具启动服务后，打开 
<http://localhost:3000/avos>，通过 UI 测试云函数。

在生产环境的调用方法请参考 
[云函数文档](https://leancloud.cn/docs/leanengine_cloudfunction_guide-node.html#调用云函数)
。**注意云函数的调用，参数是通过 JSON 文档的形式传递的**。

### sign2

说明见 [网站托管](#网站托管) 部分相应的内容。

详情请参考 [实时通信云引擎集成文档](https://leancloud.cn/docs/realtime_v2.html#云引擎_Hook)。

## 联系

* [sunng87](https://github.com/sunng87) nsun@leancloud.rocks
