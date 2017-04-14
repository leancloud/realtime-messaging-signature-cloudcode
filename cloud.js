var AV = require('leanengine');

var APPID = process.env.LC_APP_ID;
var MASTER_KEY = process.env.LC_APP_MASTER_KEY;

var common = require('./common');


AV.Cloud.define('connect', function (request, response) {
  var client_id = request.params['client_id'];
  // 这里可以执行一些检验，例如您的用户系统里面是否有匹配这个 client id 的用户
  // 或者该用户存在于自定义的黑名单中
  // if(client_id is invalid){
  //   response.success({'signature':'no' });
  // }
  var ts = parseInt(new Date().getTime() / 1000);
  var nonce = common.getNonce(5);
  var msg = [APPID, client_id];
  msg.push('');
  msg.push(ts);
  msg.push(nonce);
  msg = msg.join(':');
  var sig = common.sign(msg, MASTER_KEY);

  response.success({ 'nonce': nonce, 'timestamp': ts, 'signature': sig, 'msg': msg });
});

AV.Cloud.define('startConversation', function (request, response) {
  var client_id = request.params['client_id'];
  var member_ids = request.params['members'] || [];
  var msg = [APPID, client_id];

  // 如果该用不允许创建对话可以在这里直接返回一个 no 即可
  // response.success({'signature':'no' });
  if (member_ids.length) {
    member_ids.sort();
    msg.push(member_ids.join(':'));
  } else {
    msg.push('');
  }

  var ts = parseInt(new Date().getTime() / 1000);
  var nonce = common.getNonce(5);

  msg.push(ts);
  msg.push(nonce);
  msg = msg.join(':');

  var sig = common.sign(msg, MASTER_KEY);
  response.success({ 'nonce': nonce, 'timestamp': ts, 'signature': sig, 'msg': msg });
});

AV.Cloud.define('oprateConversation', function (request, response) {
  var client_id = request.params['client_id'];
  var conv_id = request.params['conv_id'];
  var member_ids = request.params['members'] || [];
  var action = request.params['action'];

  // 如果该用不允许操作可以在这里直接返回一个 no 即可
  // response.success({'signature':'no' });

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
  response.success({ 'nonce': nonce, 'timestamp': ts, 'signature': sig, 'msg': msg });
});

AV.Cloud.define('queryMessage', function (request, response) {
  // 查询对话的聊天记录的签名实例
  var client_id = request.params['client_id'];
  var conv_id = request.params['conv_id'];
  var msg = [APPID, client_id, conv_id];
  var ts = parseInt(new Date().getTime() / 1000);
  var nonce = common.getNonce(5);
  msg.push(ts);
  msg.push(nonce);
  msg = msg.join(':');
  var sig = common.sign(msg, MASTER_KEY);
  response.success({ 'nonce': nonce, 'timestamp': ts, 'signature': sig, 'msg': msg });
});

// 实时通信云代码 hook，消息到达
AV.Cloud.define('_messageReceived', function (request, response) {
  // 关于 request 中可用的参数可以查看文档
  // https://leancloud.cn/docs/realtime.html#%E4%BA%91%E4%BB%A3%E7%A0%81-hook
  response.success({});
});

// 实时通信云代码 hook，收件人离线
AV.Cloud.define('_receiversOffline', function (request, response) {
  // 关于 request 中可用的参数可以查看文档
  // https://leancloud.cn/docs/realtime.html#%E4%BA%91%E4%BB%A3%E7%A0%81-hook
  response.success({});
});
