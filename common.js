var crypto = require('crypto');

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

module.exports = {
  'sign': sign,
  'getNonce': getNonce
};
