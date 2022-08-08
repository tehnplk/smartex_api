var express = require('express');
var router = express.Router();
var knex = require('../con_db');
//var knex2 = require('../con_db');
var md5 = require('md5')
const main_hoscode = '11452'

function cor(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

}

async function check_token(token) {
    n = false
    r = await knex.raw(`select * from api_token where token = '${token}' and active = '1'`)
    if (r[0].length > 0) {
        n = true
        await knex.raw(`update api_token set last_request = now() where token = '${token}'`)
    }
    return n
}


router.get('/', async function (req, res, next) {

    res.json({
        'ok': 'ok'
    })
});



router.post('/diag', async function (req, res, next) {
    cor(res)
    console.log('sub diag', req.body)
    cid = req.body.cid
    api_token = req.body.api_token

    sql = `select *,group_concat(dx_name) dx_name2 from diag where md5(cid)='${cid}' 
    and hoscode not in  ('${main_hoscode}')
    group by hoscode,date_serv order by date_serv DESC `

    auth = await check_token(api_token)
    if (auth == true) {
        r = await knex.raw(sql)
        res.json(r[0]);
    } else {
        res.json([])
    }


});


router.post('/drug', async function (req, res, next) {
    cor(res)
    console.log('sub drug', req.body)
    cid = req.body.cid
    hoscode = req.body.hoscode
    //cid = md5(cid)
    date_serv = req.body.date_serv
    sql = `select * from drug where date_serv = '${date_serv}' and hoscode = '${hoscode}' and cid = '${cid}' 
    and hoscode not in  ('${main_hoscode}')
    `
    //console.log(sql)
    r = await knex.raw(sql)
    //console.log(r)
    res.json(r[0]);
});

router.post('/lab', async function (req, res, next) {
    cor(res)
    console.log('sub lab', req.body)
    cid = req.body.cid
    hoscode = req.body.hoscode
    //cid = md5(cid)
    date_serv = req.body.date_serv
    sql = `select * from lab where date_serv = '${date_serv}' and hoscode = '${hoscode}' and cid = '${cid}' 
    and hoscode not in  ('${main_hoscode}')
    `
    r = await knex.raw(sql)
    //console.log(r)
    res.json(r[0]);

})

router.post('/allergy', async function (req, res, next) {
    cor(res)
    console.log('sub allergy', req.body)
    cid = req.body.cid
    sql = `select * from allergy where md5(cid) = '${cid}'`
    r = await knex.raw(sql)
    res.json(r[0])

})

router.post('/appoint', async function (req, res, next) {
    cor(res)
    console.log('sub appoint', req.body)
    cid = req.body.cid
    sql = `SELECT * from (
        select * from appoint where nextdate >= CURRENT_DATE  AND md5(cid) = '${cid}'   
        
        ) a  ORDER BY a.nextdate ASC limit 1
    `
    r = await knex.raw(sql)
    res.json(r[0])

})


module.exports = router;

