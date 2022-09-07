const e = require('express');
var express = require('express');
var knex = require('../con_db');
var router = express.Router();


router.post('/login', async (req, res) => {
    const { username, password } = req.body
    rows = await knex('api_token').where({
        username: username,
        password: password,
        active:'1'
    }).select('username')
    console.log('rows' , rows.length)
    if (rows.length) {
        res.json({
            'login': '1'
        })
    }else{
        res.json({
            'login': '0'
        }) 
    }

});


router.get('/test', (req, res) => {
    res.json({ "test": "ok-hos" })
});

module.exports = router;
