const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async function (req, res, next) {
    try {
      const results = await db.query(
            `SELECT * FROM companies`);
  
      return res.json({companies: results.rows});
    }
  
    catch (err) {
      return next(err);
    }
  });

router.get("/search", async function (req, res, next) {

  try {
        const { code }  = req.query
        //console.log(code)
       const results = await db.query(`SELECT * FROM companies WHERE code=$1`, [code])
        console.log(results)
        return res.json(results.rows); 
  } catch(err) {
    return next(err);
  }
});

router.get("/:code", async function (req, res, next){
  try {
  const { code } = req.params

  const results = await db.query(`SELECT * FROM invoices WHERE comp_code=$1`, [code])

  return res.json(results.rows);
  } catch(err) {
    return next(err)
  }
})

router.post("/", async function(req, res, next) {
  try {
  const {code, name, description} = req.body;
  //console.log(code, name, description)
  //console.log(req.body)
  const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description])
  return res.status(201).json({company: results.rows[0]})
  } catch(err) {
    return next(err);
  }
});

router.patch("/:code", async function(req, res, next){
  try {
    const {code} = req.params
    const {name, description} = req.body
    console.log(code)

    const results = await db.query(`UPDATE companies SET name=$2, description=$3 WHERE code=$1 RETURNING code, name, description`, [code, name, description])
    return res.status(200).json({company: results.rows[0]})
  } catch(err) {
    return next(err)
  }
})

router.delete("/:code", async function(req, res, next){
  try {
  const { code } = req.params;
  await db.query(`DELETE FROM companies WHERE code=$1`, [code])
  return res.status(202).json({status: "deleted"})
  } catch(err) {
    return next(err)
  }
})
module.exports = router;