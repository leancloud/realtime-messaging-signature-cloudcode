// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();

var crypto = require('crypto');

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
//app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

APPID = "your-app-id"; // 你的应用 id
MASTER_KEY = "your-master-key"; //你的应用 master key

function sign(text, key) {
  // Hmac-sha1 hex digest
  return crypto.createHmac('sha1', key).update(text).digest('hex');
}

function getNonce(chars){
  var d = [];
  for (var i=0; i<chars; i++) {
    d.push(parseInt(Math.random()*10));
  }
  return d.join('');
}

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.post('/sign', function(request, response) {
  var peer_id = request.param('self_id');  // 当前用户的peer id
  // 用户要 watch 的 peer id，以 : 分隔。对 session.open 不带 watch id
  // 的情况，这个字段可以为空
  var watch_ids = request.param('watch_ids');
  // 是否是 Super peer
  var super_peer = request.param('sp');

  // 实际使用中，你可能还需要传额外的参数，帮助你验证用户的身份，在这
  // 个例子里我们放行所有，仅演示签名

  if(watch_ids && watch_ids.length > 0) {
    var watch_ids_list = watch_ids.split(':');
    // 排序
    watch_ids_list.sort();
  } else {
    var watch_ids_list = [];
  }

  // UTC 时间戳，秒数
  var ts = parseInt(new Date().getTime() / 1000);
  // 随机字符串
  var nonce = getNonce(5);

  // 构建签名消息
  var msg = [APPID, peer_id, watch_ids_list.join(':'), ts, nonce].join(':');
  if (super_peer) {
    msg = msg + ':sp';
  }

  // 签名
  sig = sign(msg, MASTER_KEY)

  // 回复：其中 nonce, timestamp, signature, watch_ids 是必要字段，需
  // 要客户端返回给实时通信服务
  response.set({'Access-Control-Allow-Origin': request.get('Origin') || "*"})
    .json({"nonce": nonce, "timestamp": ts, "signature": sig, "watch_ids": watch_ids_list,
           "sp": super_peer, "msg": msg});
});

app.post('/group_sign', function(request, response) {
  // 同上
  var peer_id = request.param('self_id');

  // 组id
  var group_id = request.param('group_id');

  // 此次组操作的 peer ids
  var group_peer_ids = request.param('group_peer_ids');

  // 组操作的行为，值包含 'join', 'invite', 'kick'
  var action = request.param('action');

  // 拆开排序
  var group_peer_ids_list = group_peer_ids.split(':');
  group_peer_ids_list.sort();

  var ts = parseInt(new Date().getTime() / 1000);
  var nonce = getNonce(5);

  // 构建签名消息
  msg = [APPID, peer_id, group_id, group_peer_ids_list.join(':'), ts, nonce, action].join(':');
  sig = sign(msg, MASTER_KEY);

  // 返回结果，同上，需要的主要是 nonce, timestamp, signature,
  // group_peer_ids 这几个字段
  response.set({'Access-Control-Allow-Origin': request.get('Origin') || "*"})
    .json({"nonce": nonce, "timestamp": ts, "signature": sig,
           "group_peer_ids": group_peer_ids_list, "group_id": group_id,
           "action": action, "msg": msg});
});

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
