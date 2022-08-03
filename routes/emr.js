var express = require('express');
var router = express.Router();
var knex = require('../con_db');

router.get('/', async function (req, res, next) {

    res.json({
        'ok': 'ok'
    })
});

router.post('/diag', async function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    cid = req.body.cid
    result = await knex('diag').where({
        cid: cid
    }).orderBy('date_serv', 'desc').orderBy('time_serv', 'desc')
    res.json(result)
});


router.post('/diag', async function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    cid = req.body.cid
    result = await knex('diag').where({
        cid: cid
    }).orderBy('date_serv', 'desc').orderBy('time_serv', 'desc')
    res.json(result)
});

router.post('/drug', async function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    cid = req.body.cid
    result = await knex('drug').where({
        cid: cid
    }).orderBy('date_serv', 'desc').orderBy('time_serv', 'desc')
    res.json(result)
});

module.exports = router;

