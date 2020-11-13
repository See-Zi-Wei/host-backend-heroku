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
    //*i not sure how to do the err msg 
    UNEXPECTED_SERVER_ERROR: {
        body: { error: 'Unable to establish connection with database', code: 'UNEXPECTED_ERROR' },
        status: 500,
    },
    OTHER_SERVER_ERROR: {
        body: { error: 'Unknown Internal Server Error', code: '' },
        status: 500,
    },
    //Queue Id QUEUE12345 Not Found-not sure how to do the show id
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
    const body = JSON.stringify(req.body);
    // console.log("object body %j", req.body);
    const company_id = body.company_id;
    const queue_id = body.queue_id;
    //JSON validation
    var queueIdValidator = validator.isValid(queue_id, validator.checkQueueId);
    var check10digits = validator.isValid(company_id, validator.check10digit);
    if (queueIdValidator && check10digits) {
        //validation success
        console.log('Queue Id validation success!');
        database.createQueue(company_id, queue_id, function (err, result) {
            //if database connection success, send the result
            if (!err) {
                res.status(201).send(result);
            } //if database connection failed, find out what is the error
            else {
                client.query('SELECT * FROM Queue WHERE queue_id = ?', [queue_id]
                    , function (err, rows) {
                        if (err) {
                            throw errors.UNEXPECTED_SERVER_ERROR;
                        }
                        //error: queue id already exists in database
                        else if (rows.length) {
                            throw errors.QUEUE_EXISTS;
                        }
                    });
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
    console.log("Status: "+status +" and queue: "+queue_id); // if got issue means what
    //JSON validation
    var queueIdValidator = validator.isValid(queue_id, validator.checkQueueId);
    var statusValidator = validator.isValid(status, validator.checkStatus);
    // lets check our validator now wait the queueid nvr validate 10digits 
    console.log("Queue Validator: "+queueIdValidator+" and Status Validator: "+statusValidator); // 
    // both is false 
    if (queueIdValidator && statusValidator) {
        console.log('Validation success!');
        if(req.body.status == 'ACTIVATE'){
            status = '1';
        }else{
            status = '0';
        }
        database.updateQueue(status, queue_id, function (err, result) {
            if (!err) {
                //200 OK
                res.status(200).send(result);
            } else {
                //Except the else if for UNEXPECTED SERVER ERROR
                //Non-existence Queue Id
                if (!result) {
                    throw errors.UNKNOWN_QUEUE;
                }
                else {
                    throw errors.UNEXPECTED_SERVER_ERROR;
                }
            }
        });
    } else if (!queueIdValidator) {
        throw errors.INVALID_BODY_QUEUE;
    }
    else if (!statusValidator) {
        throw errors.INVALID_BODY_STATUS;
    }
    else {
        throw errors.OTHER_SERVER_ERROR;
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
