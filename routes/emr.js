var express = require('express');
var router = express.Router();
var knex = require('../con_db');

router.get('/', async function (req, res, next) {

    res.json({
        'ok': 'ok'
    })
});

router.post('/diag', async function (req, res, next) {
    cid = req.body.cid
    result = await knex('diag').where({
        cid: cid
    })
    res.json(result)
});

router.post('/drug', async function (req, res, next) {
    cid = req.body.cid
    result = await knex('drug').where({
        cid: cid
    })
    res.json(result)
});

module.exports = router;

