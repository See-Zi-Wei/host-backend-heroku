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
app.get('/test', (req, res) => {
    database.test(function (err, result) {
        if (err) res.send(err)
        else res.send(result)
    })
})
app.post('/reset', (req, res) => {
    database.resetTables()
        .then(function () {
            res.send('successs')
        })
        .catch(function (err) {
            if (res.status == 500) res.send(errors.UNEXPECTED_SERVER_ERROR);
            else res.send('Server error');
        })
});

/**
 * ========================== COMPANY =========================
 */

/**
 * Company: Create Queue
 */
const errors = {
    INVALID_BODY_COMPANY: {
        body: { error: 'Company Id should be 10-digits', code: 'INVALID_JSON_BODY' },
        status: 400,
    },
    INVALID_BODY_QUEUE: {
        body: { error: 'Queue Id should be 10-character alphanumeric string', code: 'INVALID_JSON_BODY' },
        status: 400,
    },
    INVALID_QUERY_QUEUE: {
        body: { error: 'Queue Id should be 10-character alphanumeric string', code: 'INVALID_QUERY_STRING' },
        status: 400,
    },
    UNEXPECTED_SERVER_ERROR: {
        body: { error: 'Unable to establish a connection with the database', code: 'UNEXPECTED_ERROR' },
        status: 500,
    },
    INVALID_BODY_STATUS: {
        body: { error: 'Status must be either ACTIVATE or DEACTIVATE', code: 'INVALID_JSON_BODY' },
        status: 400,
    }
};

app.post('/company/queue', function (req, res) {
    // throw Error('unexpected err');
    const company_id = req.body.company_id;
    var queueIdCaseSensitive = req.body.queue_id;
    //JSON validation
    var queueIdValidator = validator.isValid(queueIdCaseSensitive, validator.checkQueueId);
    var check10digits = validator.isValid(company_id, validator.check10digit);
    console.log('QueueId Validator: ' + queueIdValidator + ' and companyId Validator:' + check10digits);
    console.log('company_id: ' + company_id + 'and queue_id:' + queue_id);
    if (queueIdValidator && check10digits) {
        console.log('Validation success!');
        //convert to uppercase
        var queue_id = queueIdCaseSensitive.toUpperCase();
        //connect to database
        database.createQueue(company_id, queue_id, function (err, result) {
            if (!err) {
                console.log('No error,result sent');
                res.status(201).send(result);
            }
            else {
                // Error code : 23505 (Unique Violation)
                if (err.code == '23505') {
                    console.log('QUEUE EXISTS');
                    res.status(422).send({ error: "Queue Id '" + queue_id + "' already exists", code: 'QUEUE_EXISTS' });
                } else {
                    console.log('UNEXPECTED_SERVER_ERROR');
                    console.log("err here " + err);
                    res.status(errors.UNEXPECTED_SERVER_ERROR.status).send(errors.UNEXPECTED_SERVER_ERROR.body);
                }
            }
        });
    }//validation failed - queue_id
    else if (!queueIdValidator) {
        res.status(errors.INVALID_BODY_QUEUE.status).send(errors.INVALID_BODY_QUEUE.body);
    }//validation failed - company_id
    else if (!check10digits) {
        res.status(errors.INVALID_BODY_COMPANY.status).send(errors.INVALID_BODY_COMPANY.body);
    }
})

/**
 * Company: Update Queue
 */
app.put('/company/queue', function (req, res) {
    var status = req.body.status;
    var queueIdCaseSensitive = req.query.queue_id;
    console.log('Status: ' + status + 'and queue:' + queueIdCaseSensitive);
    //JSON validation
    var queueIdValidator = validator.isValid(queueIdCaseSensitive, validator.checkQueueId);
    var statusValidator = validator.isValid(status, validator.checkStatus);
    console.log('Queue Validator: ' + queueIdValidator + 'and Status Validator: ' + statusValidator);
    if (queueIdValidator && statusValidator) {
        console.log('Validation success!');
        var queue_id = queueIdCaseSensitive.toUpperCase();
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
                    console.log('UNKNOWN QUEUE')
                    res.status(404).send({ error: "Queue Id '" + queue_id + "' Not Found", code: 'UNKNOWN_QUEUE' });
                } else {
                    //success
                    console.log('No error,result sent');
                    res.status(200).send(result);
                }
            } else {
                console.log('UNEXPECTED_SERVER_ERROR');
                res.status(errors.UNEXPECTED_SERVER_ERROR.status).send(errors.UNEXPECTED_SERVER_ERROR.body);
            }
        });
    }
    //validation failed - queue_id
    else if (!queueIdValidator) {
        res.status(errors.INVALID_QUERY_QUEUE.status).send(errors.INVALID_QUERY_QUEUE.body);
    }
    //validation failed - status 
    else if (!statusValidator) {
        res.status(errors.INVALID_BODY_STATUS.status).send(errors.INVALID_BODY_STATUS.body);
    }
})

/**
 * Company: Server Available
 * 
 * Company choose a queue Id, 
 * update the server available to 1 (Available), 
 * select the customer ID of the customer of the next queue number if any, 
 * if don't have then 0 as response
 */
app.put('/company/server', function (req, res) {
    var queueIdCaseSensitive = req.body.queue_id;
    console.log('and queue ID:' + queueIdCaseSensitive);
    var queueIdValidator = validator.isValid(queueIdCaseSensitive, validator.checkQueueId);
    console.log('Queue Validator: ' + queueIdValidator);
    if (queueIdValidator) {
        console.log('Validation success!');
        var queue_id = queueIdCaseSensitive.toUpperCase();
        //connect to database
        database.serverAvailable(queue_id, function (err, result) {
            //if current queue number id=0, means no customer
            //if there is no such queue_id, return Non-existence Queue Id
            if (!err) {
                if (result.length == 0) {
                    console.log('No customer');
                    res.status(200).send({ customer_id: 0 });
                }
                else if (result == 'UNKNOWN_QUEUE') {
                    console.log('UNKNOWN QUEUE')
                    res.status(404).send({ error: "Queue Id '" + queue_id + "' Not Found", code: 'UNKNOWN_QUEUE' });
                    // next({ error: "Queue Id '" + queue_id + "' Not Found", code: 'UNKNOWN_QUEUE' });
                }
                else {
                    console.log('No error,result sent');
                    res.status(200).send(result);
                }
            } else {
                console.log('UNEXPECTED_SERVER_ERROR');
                console.log('error here yoooo' + err);
                res.status(errors.UNEXPECTED_SERVER_ERROR.status).send(errors.UNEXPECTED_SERVER_ERROR.body);
            }
        });
    }
    //validation failed - queue_id
    else if (!queueIdValidator) {
        res.status(errors.INVALID_BODY_QUEUE.status).send(errors.INVALID_BODY_QUEUE.body);
    }
})

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
// app.use(function (err, req, res, next) {
//     console.log('err here:' + err);
//     console.log("unexpected err error: %j",err)
//     res.status(err.status).send(err.body)
// });

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
