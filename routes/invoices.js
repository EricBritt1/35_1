const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

router.get("/", async function (req, res, next) {
    try {
      const results = await db.query(
            `SELECT * FROM invoices`);
      
      return res.json({invoices: results.rows});
    }
  
    catch (err) {
      return next(err);
    }
  });

router.get("/search", async function (req, res, next) {
  // I don't know how to handle error of id that doesn't exist. I just get returned empty object
  try {
    const { id } = req.query

    const results = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id])

    return res.json({invoices: results.rows})
    
  } catch (err) {
    return next(err)
  }
});

router.post("/", async function (req, res, next) {
  const { comp_code, amt } = req.body;

  const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt])

  return res.json({invoices: results.rows[0]})

})

router.patch("/search", async function (req, res, next){
  try {
  const { id } = req.query;
  const { amt } = req.body;

  const results = await db.query(`UPDATE invoices SET amt=$2 WHERE id=$1 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [id, amt])

  return res.json({invoices: results.rows[0]})
  } catch (err) {
    return next(err)
  }
})

router.delete("/:id", async function(req, res, next) {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM invoices WHERE id=$1`, [id])
    return res.status(202).json({status: "deleted"})
    } catch(err) {
      return next(err)
    }

})


module.exports = router;
