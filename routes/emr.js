var express = require('express');
var router = express.Router();
var knex = require('../con_db');

router.post('/diag/<cid>', async function (req, res, next) {
    result = await knex('diag').where({
        cid: cid
    })
    res.json(result)
});

router.post('/drug/<cid>', async function (req, res, next) {
    result = await knex('drug').where({
        cid: cid
    })
    res.json(result)
});

module.exports = router;

