const express = require('express'); // DO NOT DELETE
const cors = require('cors');
const morgan = require('morgan');
const app = express(); // DO NOT DELETE

const database = require('./database');
const { json } = require('express');

app.use(morgan('dev'));
app.use(cors());

// app.use(express.json());

/**
 * =====================================================================
 * ========================== CODE STARTS HERE =========================
 * =====================================================================
 */

/**
 * ========================== SETUP APP =========================
 */

/**
 * JSON Body
 * 
 */

/**
 * ========================== RESET API =========================
 */

/**
 * Reset API
 */

/**
 * ========================== COMPANY =========================
 */

/**
 * Company: Create Queue
 * -middle to receive request
 * -code to handle this request(asume request is valid)
 */
app.post('/company/queue', function (req, res) {
    const body = req.body;
    const company_id = body.company_id;
    const queue_id = body.queue_id
    console.log(req.body);
    //do sql insert statement to insert a row
    // Promise
    //     .then(() => {
    //         //res.status(ok)
    //         //json(..)
    //     })
    //     .catch((e) => {
    //         //next(e)
    //     })
    res.send({company_id,queue_id});
})

/**
 * Company: Update Queue
 */

app.post('/company/queue', function (req, res) {
    const body = req.body;
    const company_id = body.company_id;
    const queue_id = body.queue_id
    console.log(req.body);
    //do sql insert statement to insert a row
    // Promise
    //     .then(() => {
    //         //res.status(ok)
    //         //json(..)
    //     })
    //     .catch((e) => {
    //         //next(e)
    //     })
    res.send({company_id,queue_id});
})

/**
 * Company: Server Available
 */

/**
 * Company: Arrival Rate
 */

/**
 * ========================== CUSTOMER =========================
 */

/**
 * Customer: Join Queue
 */

/**
 * Customer: Check Queue
 */

/**
 * ========================== UTILS =========================
 */

/**
 * 404
 */

/**
 * Error Handler
 */

function tearDown() {
    // DO NOT DELETE
    return database.closeDatabaseConnections();
}

/**
 *  NOTE! DO NOT RUN THE APP IN THIS FILE.
 *
 *  Create a new file (e.g. server.js) which imports app from this file and run it in server.js
 */

module.exports = { app, tearDown }; // DO NOT DELETE
