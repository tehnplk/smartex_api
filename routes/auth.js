const e = require('express');
var express = require('express');
var knex = require('../con_db');
var router = express.Router();

var axios = require('axios')
const axios_config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

var auth_ip = 'http://localhost:8081/checkuser' // จากโปรแกรม rservice

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    let user_data = 'username=' + username + '&password=' + password
    let raw = await axios.post(auth_ip, user_data, axios_config);
    console.log('login', raw.data[0])
    if (raw.data[0].status == 'true') {
        res.json({
            'login': '1'
        })
    } else {
        res.json({
            'login': '0'
        })
    }

});

router.post('/login2', async (req, res) => {
    const { username, password } = req.body
    rows = await knex('api_token').where({
        username: username,
        password: password,
        active: '1'
    }).select('username')
    console.log('login', rows.length)
    if (rows.length) {
        res.json({
            'login': '1'
        })
    } else {
        res.json({
            'login': '0'
        })
    }

});




router.get('/test', (req, res) => {
    res.json({ "test": "ok-hos" })
});

module.exports = router;
