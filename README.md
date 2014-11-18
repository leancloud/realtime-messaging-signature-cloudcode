# LeanCloud 实时通信云代码签名 Demo

本 demo 仅仅演示签名，并不包含实际业务逻辑。实际应用里你需要根据业务做相应的检查。

代码位于 cloud/app.js 中，你需要设置自己的应用 id 和 master key.

## Endpoints

### POST /sign

用于 Session open 和 watch 的签名。参数见[代码注释](https://github.com/leancloud/realtime-messaging-signature-cloudcode/blob/master/cloud/app.js)。

### POST /group_sign

用于群组操作的签名。参数见[代码注释](https://github.com/leancloud/realtime-messaging-signature-cloudcode/blob/master/cloud/app.js)。

## Contact

* [sunng87](https://github.com/sunng87) nsun@leancloud.rocks
