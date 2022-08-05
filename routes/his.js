var express = require('express');
var router = express.Router();
var knex = require('../con_his');
var md5 = require('md5')

function cor(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

}


router.get('/', async function (req, res, next) {

    res.json({
        'ok': 'ok'
    })
});

router.post('/pt', async function (req, res, next) {
    cor(res)
    console.log(req.body)
    pt_name = req.body.pt_name
    sql = `select cid,hn,concat(pname,' ',fname,' ',lname) fullname,sex,birthday from patient where name like '%${pt_name}%' `
    r = await knex.raw(sql)
    res.json(r[0]);
})

router.post('/diag', async function (req, res, next) {
    cor(res)
    console.log('diag', req.body)
    cid = req.body.cid
    sql = `select p.cid,concat(p.pname," ",p.fname," ", p.lname) as "fullname",p.sex,
    p.birthday "birth",v.hcode  as "hoscode",'' as "hosname",
    ovst.vstdate as"date_serv",ovst.vsttime as"time_serv",
    ovstdiag.icd10 as "dx_code",group_concat(concat(icd101.code," : ",icd101.name)) as "dx_name",o.cc
    from ovst
    left outer join vn_stat v on v.vn=ovst.vn
    left outer join ovstdiag on ovst.vn=ovstdiag.vn and ovstdiag.diagtype="1"
    left outer join icd101 on icd101.code=substring(ovstdiag.icd10,1,3)
    left outer join opdscreen o on o.vn=v.vn
    left outer join patient p on p.hn=ovst.hn
    where ovstdiag.icd10 is not null and md5(p.cid) = '${cid}'  group by date_serv order by date_serv DESC `
    r = await knex.raw(sql)
    //console.log(r)
    res.json(r[0]);
});


router.post('/drug', async function (req, res, next) {
    cor(res)
    console.log('drug', req.body)
    cid = req.body.cid
    //cid = md5(cid)
    date_serv = req.body.date_serv
    sql = `SELECT
    patient.cid,
    CONCAT(patient.pname,patient.fname,' ',patient.lname) AS fullname,
    sex.name AS sex,
    patient.birthday AS birth,
    vn_stat.hcode AS hoscode,
    CONCAT(hospcode.hosptype,' ',hospcode.name) AS hosname,
    opitemrece.vstdate AS date_serv,
    opitemrece.vsttime AS time_serv,
    drugitems.did AS drug_code,
    drugitems.name AS drug_name,
    drugitems.strength,
    opitemrece.qty AS drug_total,
    drugitems.units AS drug_unit,
    if(drugusage.shortlist is null,concat(sp_use.name1," ",sp_use.name2," ",sp_use.name3),drugusage.shortlist) as"drug_use"
    FROM
    vn_stat
    LEFT OUTER JOIN patient ON vn_stat.hn = patient.hn
    LEFT OUTER JOIN sex ON patient.sex = sex.code
    LEFT OUTER JOIN hospcode ON vn_stat.hcode = hospcode.hospcode
    LEFT OUTER JOIN opitemrece ON opitemrece.vn = vn_stat.vn
    INNER JOIN drugitems ON opitemrece.icode = drugitems.icode
    LEFT OUTER JOIN drugusage ON opitemrece.drugusage = drugusage.drugusage
    left outer join sp_use  on sp_use.sp_use=opitemrece.sp_use
    WHERE patient.cid = '${cid}'  and vn_stat.vstdate = '${date_serv}'`
    //console.log(sql)
    r = await knex.raw(sql)
    //console.log(r)
    res.json(r[0]);
});

router.post('/lab', async function (req, res, next) {
    cor(res)
    console.log('lab', req.body)
    cid = req.body.cid
    //cid = md5(cid)
    date_serv = req.body.date_serv
    sql = `SELECT
    patient.cid,
    CONCAT(patient.pname,patient.fname,' ',patient.lname) AS fullname,
    sex.name AS sex,
    patient.birthday AS birth,
    vn_stat.hcode AS hoscode,
    CONCAT(hospcode.hosptype,' ',hospcode.name) AS hosname,
    ovst.vstdate AS date_serv,
    ovst.vsttime AS time_serv,
    lab_order_service.lab_code,
    lab_items.lab_items_name AS lab_name,
    lab_order.lab_order_result AS lab_result,
    lab_items.lab_items_normal_value AS lab_normal
    FROM
    vn_stat
    LEFT OUTER JOIN ovst ON vn_stat.vn = ovst.vn
    LEFT OUTER JOIN patient ON vn_stat.hn = patient.hn
    LEFT OUTER JOIN sex ON patient.sex = sex.code
    LEFT OUTER JOIN hospcode ON vn_stat.hcode = hospcode.hospcode
    INNER JOIN lab_order_service ON vn_stat.vn = lab_order_service.vn
    LEFT OUTER JOIN lab_order ON lab_order.lab_order_number = lab_order_service.lab_order_number AND lab_order.lab_items_code = lab_order_service.lab_code
    LEFT OUTER JOIN lab_items ON lab_items.lab_items_code = lab_order.lab_items_code
    WHERE patient.cid = '${cid}' and ovst.vstdate = '${date_serv}' having lab_name is not null`
    r = await knex.raw(sql)
    //console.log(r)
    res.json(r[0]);

})

router.post('/allergy', async function (req, res, next) {
    cor(res)
    console.log('allergy', req.body)
    sql = `SELECT
    patient.cid,
    CONCAT(patient.pname,patient.fname,' ',patient.lname) AS fullname,
    if(patient.sex = '1','ชาย','หญิง') sex,
    patient.birthday AS birth,
    (SELECT hospitalcode FROM opdconfig LIMIT 1) AS hoscode,
    (SELECT hospitalname FROM opdconfig LIMIT 1) AS hosname,
    opd_allergy.agent,
    opd_allergy.symptom,
    opd_allergy.begin_date
    FROM
    patient
    LEFT OUTER JOIN opd_allergy ON opd_allergy.hn = patient.hn
    WHERE opd_allergy.agent IS NOT NULL 
    AND md5(patient.cid) = '${cid}'
    `
    r = await knex.raw(sql)
    res.json(r[0])

})

router.post('/appoint', async function (req, res, next) {
    cor(res)
    console.log('appoint', req.body)
    sql = `SELECT * from (
        SELECT
            patient.cid,
            CONCAT(patient.pname,patient.fname,' ',patient.lname) AS fullname,
            if(patient.sex=1,'ชาย','หญิง') sex,
            patient.birthday AS birth,
            (SELECT hospitalcode from opdconfig LIMIT 1) hoscode,
            (SELECT hospitalname from opdconfig LIMIT 1) AS hosname,
            oapp.nextdate,
            oapp.nexttime,
            clinic.name AS clinic,
            oapp.note
            FROM
            patient
            LEFT OUTER JOIN oapp ON oapp.hn = patient.hn
            LEFT OUTER JOIN clinic ON oapp.clinic = clinic.clinic
            WHERE oapp.nextdate is not NULL  AND md5(patient.cid) =  '${cid}' 
            AND oapp.nextdate >= CURRENT_DATE
        
        ) a  ORDER BY a.nextdate ASC limit 1
    `
    r = await knex.raw(sql)
    res.json(r[0])

})


module.exports = router;

