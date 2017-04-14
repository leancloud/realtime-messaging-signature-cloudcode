var express = require('express');
var bodyParser = require('body-parser');
var AV = require('leanengine');

var common = require('./common');

var APPID = process.env.LC_APP_ID;
var MASTER_KEY = process.env.LC_APP_MASTER_KEY;

// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require('./cloud');

var app = express();

// 加载云引擎中间件
app.use(AV.express());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
  response.set({'Access-Control-Allow-Origin': request.get('Origin') || '*'})
    .json({'nonce': nonce, 'timestamp': ts, 'signature': sig, 'msg': msg});
});

app.use(function(req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// error handlers
app.use(function(err, req, res, _next) {
  var statusCode = err.status || 500;
  if (statusCode === 500) {
    console.error(err.stack || err);
  }
  res.status(statusCode);
  res.send({
    message: err.message,
    error: err
  });
});

module.exports = app;
