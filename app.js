const express = require('express'); // DO NOT DELETE
const cors = require('cors');
const morgan = require('morgan');
const app = express(); // DO NOT DELETE

const database = require('./database');

app.use(morgan('dev'));
app.use(cors());

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
 */

/**
 * ========================== RESET API =========================
 */

/**
 * Reset API
 */
app.get('/test',(req,res) => {
    database.test(function(err,result){
        if(err)res.send(err)
        else res.send(result)
    })
})
app.post('/reset', (req, res) => {
    database.resetTables()
    .then(function(){
        res.send("successs")
    })
    .catch(function(err){
        if(res.status == 500) res.send(errors.SERVER_ERROR);
        else res.send("Server error");
    })
});

/**
 * ========================== COMPANY =========================
 */

/**
 * Company: Create Queue
 */

/**
 * Company: Update Queue
 */

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
const errors = {
    SERVER_ERROR: {
        body: { error: 'Unable to establish connection with database'},
        status: 500,
    }
}
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
