const express = require('express'); // DO NOT DELETE
const cors = require('cors');
const morgan = require('morgan');
const app = express(); // DO NOT DELETE

const database = require('./database');
const { json } = require('express');

app.use(morgan('dev'));
app.use(cors());

app.use(express.json());

const validator = require('./jsonValidation');
const { nextTick } = require('async');

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
        res.send("Status: " + res.status)
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
const errors = {
    QUEUE_EXISTS: {
        body: { error: 'Queue already exists', code: 'QUEUE_EXISTS' },
        status: 422,
    },
    INVALID_BODY_COMPANY: {
        body: { error: 'Company Id should be 10-digits', code: 'INVALID_JSON_BODY' },
        status: 400,
    },
    INVALID_BODY_QUEUE: {
        body: { error: 'Queue Id should be 10-character alphanumeric string', code: 'INVALID_JSON_BODY' },
        status: 400,
    },
    //#not sure how to show exactly the error, eg: error:unable to connect to database
    UNEXPECTED_SERVER_ERROR: {
        body: { error: 'Unexpected server error', code: 'UNEXPECTED_ERROR' },
        status: 500,
    },
    OTHER_SERVER_ERROR: {
        body: { error: 'Unknown Internal Server Error', code: '' },
        status: 500,
    },
    SERVER_ERROR: {
        body: { error: 'Unable to establish connection with database'},
        status: 500,
    },
    //#Queue Id QUEUE12345 Not Found - not sure how to show the exact id
    UNKNOWN_QUEUE: {
        body: { error: 'Queue Id Not Found', code: 'UNKNOWN_QUEUE' },
        status: 404,
    },
    INVALID_BODY_STATUS: {
        body: { error: 'Status must be either ACTIVATE or DEACTIVATE', code: 'INVALID_JSON_BODY' },
        status: 400,
    },
};

app.post('/company/queue', function (req, res) {
    const company_id = req.body.company_id;
    const queue_id = req.body.queue_id;
    console.log('company_id: ' + company_id + 'and queue_id:' + queue_id);
    //JSON validation
    var queueIdValidator = validator.isValid(queue_id, validator.checkQueueId);
    var check10digits = validator.isValid(company_id, validator.check10digit);
    console.log('QueueId Validator: ' + queueIdValidator + ' and companyId Validator:' + check10digits);
    if (queueIdValidator && check10digits) {
        console.log('Validation success!');
        //connect to database
        database.createQueue(company_id, queue_id, function (err, result) {
            if (!err) {
                res.status(201).send(result);
            }
            else {
                if (result) {
                    throw errors.QUEUE_EXISTS;
                }
                else {
                    throw errors.UNEXPECTED_SERVER_ERROR;
                }
            }
        });
    }//validation failed - queue_id
    else if (!queueIdValidator) {
        throw errors.INVALID_BODY_QUEUE;
    }//validation failed - company_id
    else if (!check10digits) {
        throw errors.INVALID_BODY_COMPANY;
    }//other server error
    else {
        throw errors.OTHER_SERVER_ERROR;
    }
})

/**
 * Company: Update Queue
 */
app.put('/company/queue/:queue_id', function (req, res) {
    var status = req.body.status;
    const queue_id = req.params.queue_id;
    console.log('Status: ' + status + 'and queue:' + queue_id);
    //JSON validation
    var queueIdValidator = validator.isValid(queue_id, validator.checkQueueId);
    var statusValidator = validator.isValid(status, validator.checkStatus);
    console.log('Queue Validator: ' + queueIdValidator + 'and Status Validator: ' + statusValidator);
    if (queueIdValidator && statusValidator) {
        console.log('Validation success!');
        if (req.body.status == 'ACTIVATE') {
            status = '1';
        } else {
            status = '0';
        }
        //connect to database
        database.updateQueue(status, queue_id, function (err, result) {
            if (!err) {
                //unknown queue(queue_id not found in database)
                if (result.length == 0) {
                    console.log("UNKNOWN QUEUE")
                    res.status(errors.UNKNOWN_QUEUE.status).send(errors.UNKNOWN_QUEUE.body);
                } else {
                    //success
                    console.log("No error,result sent")
                    res.status(200).send(result);
                }
            } else {
                console.log("UNEXPECTED_SERVER_ERROR")
                res.status(errors.UNEXPECTED_SERVER_ERROR.status).send(errors.UNEXPECTED_SERVER_ERROR.body);
            }
        });
    }
    //queue_id wrong
    else if (!queueIdValidator) {
        res.status(errors.INVALID_BODY_QUEUE.status).send(errors.INVALID_BODY_QUEUE.body);
    }
    //status wrong
    else if (!statusValidator) {
        res.status(errors.INVALID_BODY_STATUS.status).send(errors.INVALID_BODY_STATUS.body);
    }
    else {
        res.status(errors.OTHER_SERVER_ERROR.status).send(errors.OTHER_SERVER_ERROR.body);
    }
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
