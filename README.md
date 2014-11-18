# LeanCloud 实时通信云代码签名 Demo

本 demo 仅仅演示签名，并不包含实际业务逻辑。实际应用里你需要根据业务做相应的检查。

代码位于 `cloud/app.js` 中，你需要设置自己的应用 id 和 master key.

你可以通过[云代码命令行工具](https://cn.avoscloud.com/docs/cloud_code_commandline.html)在本地运行这个项目。

## Endpoints

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

## Contact

* [sunng87](https://github.com/sunng87) nsun@leancloud.rocks
