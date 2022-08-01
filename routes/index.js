var express = require('express');
var router = express.Router();
var knex = require('../con_db');

var mqttHandler = require('../mqtt_handle');

var mqttClient = new mqttHandler();

var socket_client = require("socket.io-client")('http://localhost:3000');

router.get('/io/:cid', async function (req, res, next) {
  cid = req.params.cid
  await socket_client.emit("cid", cid);
  res.json({
    'io emit': cid
  })
});


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'SmartEx API 1.0.1' });
});
router.post('/test', function (req, res, next) {
  res.json({
    'test_api': 'success'
  })
});

router.get("/mqtt/:msg", function (req, res) {

  r = mqttClient.sendMessage(req.params.msg);
  //console.log(r)
  res.json({
    'mqtt emit': req.params.msg
  })
});


router.post('/diag', async function (req, res, next) {

  d_update = new Date();
  //console.log(req.body.data, req.body.data.length);
  var result = 'err'
  try {
    result = await knex('diag')
      .insert({
        id: null,
        cid: req.body.data[0],
        fullname: req.body.data[1],
        sex: req.body.data[2],
        birth: req.body.data[3],
        hoscode: req.body.data[4],
        hosname: req.body.data[5],
        date_serv: req.body.data[6],
        time_serv: req.body.data[7],
        dx_code: req.body.data[8],
        dx_name: req.body.data[9],
        cc: req.body.data[10],
        d_update: d_update
      })

  } catch (error) {
    //console.log(error)
    result = error.code
  }

  res.json({
    'send_to_diag': {
      'result': result
    }
  })



});

router.post('/drug', async function (req, res, next) {
  //console.log(req.body.data)
  res.json({
    'send_to_drug': {
      'result': 'success'
    }
  })
});


module.exports = router;
