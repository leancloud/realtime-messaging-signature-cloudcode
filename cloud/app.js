// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var common = require('cloud/common.js');

var app = express();

// App 全局配置
app.use(express.bodyParser());    // 读取请求 body 的中间件
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type");
  res.header("Access-Control-Allow-Methods", "POST");
  next();
});

APPID = AV.applicationId; // 你的应用 id
MASTER_KEY = AV.masterKey; //你的应用 master key

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.post('/sign', function(request, response) {
  var peer_id = request.body['self_id'];  // 当前用户的peer id
  // watch_ids 数组。对 session.open 不带 watch id
  // 的情况，这个字段可以为空
  var watch_ids = request.body['watch_ids'] || [];
  // 是否是 Super peer
  var super_peer = request.body['sp'];

  // 实际使用中，你可能还需要传额外的参数，帮助你验证用户的身份，在这
  // 个例子里我们放行所有，仅演示签名

  watch_ids.sort();

  // UTC 时间戳，秒数
  var ts = parseInt(new Date().getTime() / 1000);
  // 随机字符串
  var nonce = common.getNonce(5);

  // 构建签名消息
  var msg = [APPID, peer_id, watch_ids.join(':'), ts, nonce].join(':');
  if (super_peer) {
    msg = msg + ':sp';
  }

  // 签名
  sig = common.sign(msg, MASTER_KEY)

  // 回复：其中 nonce, timestamp, signature, watch_ids 是必要字段，需
  // 要客户端返回给实时通信服务
  response.set({'Access-Control-Allow-Origin': request.get('Origin') || "*"})
    .json({"nonce": nonce, "timestamp": ts, "signature": sig, "watch_ids": watch_ids,
           "sp": super_peer, "msg": msg});
});

app.post('/group_sign', function(request, response) {
  // 同上
  var peer_id = request.body['self_id'];

  // 组id
  var group_id = request.body['group_id'];

  // 此次组操作的 peer ids
  var group_peer_ids = request.param['group_peer_ids'] || [];

  // 组操作的行为，值包含 'join', 'invite', 'kick'
  var action = request.param('action');

  // 拆开排序
  group_peer_ids.sort();

  var ts = parseInt(new Date().getTime() / 1000);
  var nonce = common.getNonce(5);

  // 构建签名消息
  msg = [APPID, peer_id, group_id, group_peer_ids.join(':'), ts, nonce, action].join(':');
  sig = common.sign(msg, MASTER_KEY);

  // 返回结果，同上，需要的主要是 nonce, timestamp, signature,
  // group_peer_ids 这几个字段
  response.set({'Access-Control-Allow-Origin': request.get('Origin') || "*"})
    .json({"nonce": nonce, "timestamp": ts, "signature": sig,
           "group_peer_ids": group_peer_ids, "group_id": group_id,
           "action": action, "msg": msg});
});

app.post('/sign2', function(request, response){
  var client_id = request.body['client_id'];
  var conv_id = request.body['conv_id'];
  var member_ids = request.body['members'] || [];
  var action = request.body['action'];

  var ts = parseInt(new Date().getTime() / 1000);
  var nonce = common.getNonce(5);

  var msg = [APPID, client_id];
  if (conv_id) {
    msg.push(conv_id);
  }

  if (member_ids.length) {
    member_ids.sort();
    msg.push(member_ids.join(':'));
  } else {
    msg.push('');
  }

  msg.push(ts);
  msg.push(nonce);
  if (action) {
    msg.push(action);
  }
  msg = msg.join(':');

  var sig = common.sign(msg, MASTER_KEY);
  response.set({'Access-Control-Allow-Origin': request.get('Origin') || "*"})
    .json({"nonce": nonce, "timestamp": ts, "signature": sig, "msg": msg});
});

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
