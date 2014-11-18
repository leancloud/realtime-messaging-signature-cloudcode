# LeanCloud 实时通信云代码签名 Demo

本 demo 仅仅演示签名，并不包含实际业务逻辑。实际应用里你需要根据业务做
相应的检查。这个 demo 同时包含了 [web hosting](https://cn.avoscloud.com/docs/cloud_code_guide.html#web-hosting) 和
[云函数（cloud function）](https://cn.avoscloud.com/docs/cloud_code_guide.html#cloud-%E5%87%BD%E6%95%B0)
两种签名的方式，你可以根据自己的需要选择实现方式。一般来说，云函数部署
方便，参数以 json 文档格式 POST 到服务；而 Web Hosting 提供更灵活的接
口。

你可以通过[云代码命令行工
具](https://cn.avoscloud.com/docs/cloud_code_commandline.html)在本地运
行这个项目，同时别忘了修改 `config/global.json` 设置你的应用数据。

## Web Hosting

通过 web hosting，你可以直接编写服务器端 http 接口，绑定域名后访问。

### POST /sign

用于 Session open 和 watch 的签名。参数说明见
[代码注释](https://github.com/leancloud/realtime-messaging-signature-cloudcode/blob/master/cloud/app.js)
。

调用例子（使用 [httpie](http://httpie.org) 为例）：

```
 $ http  --form post http://localhost:3000/sign self_id=1 watch_ids=2:3:4
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 205
Content-Type: application/json; charset=utf-8
Date: Tue, 18 Nov 2014 06:05:28 GMT
X-Powered-By: Express

{
    "msg": "your-app-id:1:2:3:4:1416290728:85561",
    "nonce": "85561",
    "signature": "cf4a1b6b55ff87753da4ae7f5dd2c33273108b62",
    "timestamp": 1416290728,
    "watch_ids": [
        "2",
        "3",
        "4"
    ]
}
```

### POST /group_sign

用于群组操作的签名。参数说明见
[代码注释](https://github.com/leancloud/realtime-messaging-signature-cloudcode/blob/master/cloud/app.js)
。

```
 $ http  --form post http://localhost:3000/group_sign self_id=1 group_peer_ids=2:3:4 group_id=4ad934r23bjhcas action=join
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 284
Content-Type: application/json; charset=utf-8
Date: Tue, 18 Nov 2014 06:07:59 GMT
X-Powered-By: Express

{
    "action": "join",
    "group_id": "4ad934r23bjhcas",
    "group_peer_ids": [
        "2",
        "3",
        "4"
    ],
    "msg": "your-app-id:1:4ad934r23bjhcas:2:3:4:1416290879:07995:join",
    "nonce": "07995",
    "signature": "d31efcdea5d74db8d510ce0e9a4833e9bbc205e3",
    "timestamp": 1416290879
}
```

## 云函数

在开发环境可以通过 avoscloud 命令行工具启动服务后，打开
http://localhost:3000/avos 通过 UI 测试云函数。

在生产环境的调用方法请
[参考文档](https://cn.avoscloud.com/docs/cloud_code_guide.html#%E8%B0%83%E7%94%A8%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0)
。**注意云函数的调用，参数是通过 json 文档的形式传递的**。

### sign

用于 Session open 和 watch 的签名，参数如：

```json
{"self_id": "ak47", "watch_ids": ["desert_eagle", "AWG"]}
```

### group_sign

用于群组操作的签名，参数如:

```json
{"self_id": "ak47", "group_id": "482222222",
"group_peer_ids":["desert_eagle"], "action": "invite"}
```

## Contact

* [sunng87](https://github.com/sunng87) nsun@leancloud.rocks
