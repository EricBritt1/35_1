const express = require("express");
const app = express();
const ExpressError = require("./expressError");

// Parse request bodies for JSON
app.use(express.json());

const compRoutes = require("./routes/companies");

app.use("/companies", compRoutes);

const invRoutes = require("./routes/invoices")

app.use("/invoices", invRoutes)

//
app.use(function(req, res, next) {
    const err = new ExpressError("Not Found", 404);

    return next(err)
});

app.use(function (err, req, res, next) {
    let status = err.status || 500;

    return res.status(status).json({
        error: {
            message: err.message,
            status: status
        }
    });
});

module.exports = app;