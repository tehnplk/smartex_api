var express = require('express');
var router = express.Router();


var socket_client = require("socket.io-client")('http://localhost:3000');


router.get('/cid/:cid', async function(req, res, next) {
  cid = req.params.cid
  await socket_client.emit("cid", cid);
  res.json({
    'emit':cid
  })
});

module.exports = router;
