require("cloud/app.js");

var common = require('cloud/common.js');

APPID = AV.applicationId; // 你的应用 id
MASTER_KEY = AV.masterKey; //你的应用 master key

AV.Cloud.define("sign", function(request, response) {
  var peer_id = request.params['self_id'];  // 当前用户的peer id
  // 用户要 watch 的 peer ids， 数组
  var watch_ids = request.params['watch_ids'] || [];
  // 是否是 Super peer
  var super_peer = request.params['sp'];

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
  response.success({"nonce": nonce, "timestamp": ts, "signature": sig, "watch_ids": watch_ids,
                    "sp": super_peer, "msg": msg});
});

AV.Cloud.define("group_sign", function(request, response) {
  // 同上
  var peer_id = request.params['self_id'];

  // 组id
  var group_id = request.params['group_id'];

  // 此次组操作的 peer ids
  var group_peer_ids = request.params['group_peer_ids'] || [];

  // 组操作的行为，值包含 'join', 'invite', 'kick'
  var action = request.params['action'];

  // 排序
  group_peer_ids.sort();

  var ts = parseInt(new Date().getTime() / 1000);
  var nonce = common.getNonce(5);

  // 构建签名消息
  msg = [APPID, peer_id, group_id, group_peer_ids.join(':'), ts, nonce, action].join(':');
  sig = common.sign(msg, MASTER_KEY);

  // 返回结果，同上，需要的主要是 nonce, timestamp, signature,
  // group_peer_ids 这几个字段
  response.success({"nonce": nonce, "timestamp": ts, "signature": sig,
                    "group_peer_ids": group_peer_ids, "group_id": group_id,
                    "action": action, "msg": msg});

});

//返回 V2 聊天 SDK 登陆服务器的签名
AV.Cloud.define("connect", function(request, response) {
  var client_id = request.params['client_id'];  // 当前用户的client_id
  var super_peer = request.params['sp'];
  // 实际使用中，你可能还需要传额外的参数，帮助你验证用户的身份，在这
  // 个例子里我们放行所有，仅演示签名

  // UTC 时间戳，秒数
  var ts = parseInt(new Date().getTime() / 1000);
  // 随机字符串
  var nonce = common.getNonce(5);

  // 构建签名消息
  var msg = [APPID, client_id, '', ts, nonce].join(':');
  if (super_peer) {
    msg = msg + ':sp';
  }

  // 签名
  sig = common.sign(msg, MASTER_KEY)

  // 回复：其中 nonce, timestamp, signature, watch_ids 是必要字段，需
  // 要客户端返回给实时通信服务
  response.success({"nonce": nonce, "timestamp": ts, "signature": sig,
                    "sp": super_peer, "msg": msg});
});
//返回对话成员管理的签名
AV.Cloud.define("actionOnCoversation", function (request, response) {
    var conversationId = request.params['conversation_id'];
    var client_id = request.params['client_id'];
    var memberIds = request.params['member_ids'] || [];
    var action = request.params['action'];

    // 排序
    memberIds.sort();

    var ts = parseInt(new Date().getTime() / 1000);
    var nonce = common.getNonce(5);


    // 构建签名消息
    
    msg = [APPID, client_id, conversationId, memberIds.join(':'), ts, nonce, action].join(':');
  
    sig = common.sign(msg, MASTER_KEY);

    // 返回结果，同上，需要的主要是 nonce, timestamp, signature,
    // group_peer_ids 这几个字段
    response.success({ "nonce": nonce, "timestamp": ts, "signature": sig,
        "memberIds": memberIds, "conversationId": conversationId,
        "action": action, "msg": msg});
    //以上返回的签名是一个 合法 的签名，合法的意思是 client_id 可以 对 conversationId 进行 action 的操作
    //也就是签名这项操作就是为了鉴权，为了提供一个 Hook 给开发者去管理 Client 是否 对某一个 Conversation 有 某一个 Action 的操作权限，如果有就按照如上的代码正确返回
    //如果没有就返回一个错误的签名，错误的签名可以是任何字符串

});

//获取创建对话的签名
AV.Cloud.define("startConversation", function (request, response) {
     var client_id = request.params['client_id'];
     var memberIds = request.params['member_ids'] || [];

     // 排序
     memberIds.sort();

     var ts = parseInt(new Date().getTime() / 1000);
     var nonce = common.getNonce(5);

     msg = [APPID, client_id, memberIds.join(':'), ts, nonce].join(':');
  
     sig = common.sign(msg, MASTER_KEY);

     // 返回结果，同上，需要的主要是 nonce, timestamp, signature,
     // memberIds 这几个字段
     response.success({ "nonce": nonce, "timestamp": ts, "signature": sig,
        "memberIds": memberIds,"msg": msg});
});

//获取聊天历史记录的签名
AV.Cloud.define("queryHistory", function (request, response) {
     var client_id = request.params['client_id'];
     var convId = request.params['convid'] || [];

     // 排序
     memberIds.sort();

     var ts = parseInt(new Date().getTime() / 1000);
     var nonce = common.getNonce(5);

     msg = [APPID, client_id, convId, ts, nonce].join(':');
  
     sig = common.sign(msg, MASTER_KEY);

     // 返回结果，同上，需要的主要是 nonce, timestamp, signature,
     response.success({ "nonce": nonce, "timestamp": ts, "signature": sig,
        "convId": convId,"msg": msg});
});

// 实时通信云代码 hook，消息到达
AV.Cloud.define("_messageReceived", function(request, response) {
  // 关于 request 中可用的参数可以查看文档
  // https://leancloud.cn/docs/realtime.html#%E4%BA%91%E4%BB%A3%E7%A0%81-hook
  response.success({});
});

// 实时通信云代码 hook，收件人离线
AV.Cloud.define("_receiversOffline", function(request, response) {
  // 关于 request 中可用的参数可以查看文档
  // https://leancloud.cn/docs/realtime.html#%E4%BA%91%E4%BB%A3%E7%A0%81-hook
  response.success({});
});
