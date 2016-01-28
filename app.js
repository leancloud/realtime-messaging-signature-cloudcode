'use strict';
var domain = require('domain');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cloud = require('./cloud');
var common = require('./common');

var app = express();

var APPID = process.env.LC_APP_ID;
var MASTER_KEY = process.env.LC_APP_MASTER_KEY;

// 设置 view 引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 加载云代码方法
app.use(cloud);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 未处理异常捕获 middleware
app.use(function(req, res, next) {
  var d = null;
  if (process.domain) {
    d = process.domain;
  } else {
    d = domain.create();
  }
  d.add(req);
  d.add(res);
  d.on('error', function(err) {
    console.error('uncaughtException url=%s, msg=%s', req.url, err.stack || err.message || err);
    if(!res.finished) {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json; charset=UTF-8');
      res.end('uncaughtException');
    }
  });
  d.run(next);
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

// 如果任何路由都没匹配到，则认为 404
// 生成一个异常让后面的 err handler 捕获
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) { // jshint ignore:line
    var statusCode = err.status || 500;
    if(statusCode === 500) {
      console.error(err.stack || err);
    }
    res.status(statusCode);
    res.render('error', {
      message: err.message || err,
      error: err
    });
  });
}

// 如果是非开发环境，则页面只输出简单的错误信息
app.use(function(err, req, res, next) { // jshint ignore:line
  res.status(err.status || 500);
  res.render('error', {
    message: err.message || err,
    error: {}
  });
});

module.exports = app;
