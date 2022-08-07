var express = require('express');
var router = express.Router();
var knex = require('../con_db');

var mqttHandler = require('../mqtt_handle');

var mqttClient = new mqttHandler();

var socket_client = require("socket.io-client")('http://localhost:3000');


router.get('/sql', async function (req, res, next) {
  result = await knex('c_sql').where({
    note: '1'
  }).select('id', 'cmd')
  res.json(result)
});

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
  console.log(req.body);
  var result = 'err'
  try {
    result = await knex('diag')
      .insert(req.body)

  } catch (error) {
    console.log(error)
    result = error.code
  }

  res.json({
    'send_to_diag': {
      'result': result
    }
  })



});

router.post('/drug', async function (req, res, next) {
  d_update = new Date();
  console.log(req.body);
  var result = 'err'
  try {
    result = await knex('drug')
      .insert(req.body)

  } catch (error) {
    console.log(error)
    result = error.code
  }

  res.json({
    'send_to_drug': {
      'result': result
    }
  })
});

router.post('/lab', async function (req, res, next) {
  d_update = new Date();
  console.log(req.body);
  var result = 'err'
  try {
    result = await knex('lab')
      .insert(req.body)

  } catch (error) {
    console.log(error)
    result = error.code
  }

  res.json({
    'send_to_lab': {
      'result': result
    }
  })
});

router.post('/allergy', async function (req, res, next) {
  d_update = new Date();
  console.log(req.body);
  var result = 'err'
  try {
    result = await knex('allergy')
      .insert(req.body)

  } catch (error) {
    console.log(error)
    result = error.code
  }

  res.json({
    'send_to_allergy': {
      'result': result
    }
  })
});

router.post('/appoint', async function (req, res, next) {
  d_update = new Date();
  console.log(req.body);
  var result = 'err'
  try {
    result = await knex('appoint')
      .insert(req.body)

  } catch (error) {
    console.log(error)
    result = error.code
  }

  res.json({
    'send_to_appoint': {
      'result': result
    }
  })
});

router.post('/test', async function (req, res, next) {
  console.log(req.body)
  try {
    result = await knex('drug')
      .insert(req.body)

  } catch (error) {
    console.log(error)
    result = error.code
  }
  res.json({
    'status': 'success'
  })

});


module.exports = router;
