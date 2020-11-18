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
    INVALID_BODY_CUSTOMER: {
        body: { error: 'Customer Id should be 10-digits', code: 'INVALID_QUERY_STRING' },
        status: 400,
    },
    INVALID_BODY_QUEUE: {
        body: { error: 'Queue Id should be 10-character alphanumeric string', code: 'INVALID_JSON_BODY' },
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
    const company_id = req.body.company_id;
    var queue_id = req.body.queue_id;
    //#(consultation)ask cher if this way is the way he want us to do for not case sensitive
    var queue_id = queue_id.toUpperCase();
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
    }//other server error
    else {
        res.status(errors.OTHER_SERVER_ERROR.status).send(errors.OTHER_SERVER_ERROR.body);
    }
});

/**
 * Company: Update Queue
 */
app.put('/company/queue/:queue_id', function (req, res) {
    var status = req.body.status;
    var queue_id_CaseSensitive = req.params.queue_id;
    //#(consultation)ask cher if this way is the way he want us for not case sensitive
    var queue_id = queue_id_CaseSensitive.toUpperCase();
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
        res.status(errors.INVALID_BODY_QUEUE.status).send(errors.INVALID_BODY_QUEUE.body);
    }
    //validation failed - status 
    else if (!statusValidator) {
        res.status(errors.INVALID_BODY_STATUS.status).send(errors.INVALID_BODY_STATUS.body);
    }
    else {
        res.status(errors.OTHER_SERVER_ERROR.status).send(errors.OTHER_SERVER_ERROR.body);
    }
});

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
app.get('/customer/queue', function (req, res) {
    var customer_id=req.query.customer_id;
    if(customer_id !== '')customer_id= parseInt(req.query.customer_id)
    else customer_id=undefined;
    var queue_id_CaseSensitive = req.query.queue_id;
    var queue_id = queue_id_CaseSensitive.toUpperCase();
    console.log('Customerid: ' + customer_id + ' and queue: ' + queue_id);
    //JSON validation
    var queueIdValidator = validator.isValid(queue_id, validator.checkQueueId);
    var customeridvalidator = validator.isValid(customer_id, validator.check10digit);
    // if customer_id is not provided let validator pass through
    if(customer_id == undefined)customeridvalidator = true;
    console.log('Queue Validator: ' + queueIdValidator + ' and customer Validator: ' + customeridvalidator);
    if(queueIdValidator && customeridvalidator){
        database.checkQueue(queue_id,customer_id, function(err,result){
            var output={total: 0, ahead: '', status: 'INACTIVE'}
            if(!err){
                output.total = result.total-result.current_queue_number;
                //if customerid provided
                if (result.status == 1){
                    output.status = 'ACTIVE'
                    if(customer_id !== undefined){
                        //missed queue
                        if (result.queue_number < result.current_queue_number) {
                            output.ahead = -1;
                            res.status(200).send(output);
                        }
                        // position in queue
                        else if(result.queue_number > result.current_queue_number) {
                            output.ahead = result.queue_number-result.current_queue_number;
                            res.status(200).send(output);
                        }
                        // next to be assigned
                        else if (result.queue_number == result.current_queue_number) {
                            output.ahead = 0;
                            res.status(200).send(output);
                        }
                        // never joined
                        else {
                            output.ahead = -1;
                            res.status(200).send(output);
                        }
                    }
                    //customer id not provided
                    else {
                        output.ahead = -1;
                        res.status(200).send(output);
                    }
                }
                // QUEUE inactive
                else{
                    if(customer_id !== undefined){
                        //missed queue
                        if (result.queue_number < result.current_queue_number) {
                            output.ahead = -1;
                            res.status(200).send(output);
                        }
                        // position in queue
                        else if(result.queue_number > result.current_queue_number) {
                            output.ahead = result.queue_number-result.current_queue_number;
                            res.status(200).send(output);
                        }
                        // next to be assigned
                        else if (result.queue_number == result.current_queue_number) {
                            output.ahead = 0;
                            res.status(200).send(output);
                        }
                        // never joined
                        else {
                            output.ahead = -1;
                            res.status(200).send(output);
                        }
                    }
                    //customer id not provided
                    else {
                        output.ahead = -1;
                        res.status(200).send(output);
                    }
                }    
            }
            // queue id not found
            else if(result == '') {
                res.status(404).send({ error: "Queue Id '" + queue_id + "' Not Found", code: 'UNKNOWN_QUEUE' });
            }
            else{
                res.status(errors.UNEXPECTED_SERVER_ERROR.status).send(errors.UNEXPECTED_SERVER_ERROR.body);
            }
        });
    }
    //invalid customer id
    else if(!customeridvalidator){
        res.status(errors.INVALID_BODY_CUSTOMER.status).send(errors.INVALID_BODY_CUSTOMER.body);
    }
    //invalid queue id
    else if (!queueIdValidator) {
        res.status(errors.INVALID_BODY_QUEUE.status).send(errors.INVALID_BODY_QUEUE.body);
    }else {
        res.status(errors.UNEXPECTED_SERVER_ERROR.status).send(errors.UNEXPECTED_SERVER_ERROR.body);
    }
});

app.post('/customer/queue', function (req, res){
    var customer_id=req.body.customer_id;
    var queue_id_CaseSensitive = req.body.queue_id;
    var queue_id = queue_id_CaseSensitive.toUpperCase();
    console.log('Customerid: ' + customer_id + ' and queue: ' + queue_id);
    //JSON validation
    var queueIdValidator = validator.isValid(queue_id, validator.checkQueueId);
    var customeridvalidator = validator.isValid(customer_id, validator.check10digit);
    if(queueIdValidator && customeridvalidator){
        database.joinQueue(customer_id,queue_id,function(err,result){
            if(!err){
                //queue is active
                if(result !== false){
                    //customer already in queue
                    if(result == 'EXIST'){
                        res.status(422).send({ error: "Customer '" + customer_id + "' is already in Queue '" +queue_id+ "'", code: 'ALREADY_IN_QUEUE' });
                    }
                    else if(result == 'SUCCESS'){
                        res.status(201);
                    }
                    else{
                        res.status(422).send({ error: "Queue ID '" + queue_id + "' not found", code: 'UNKNOWN_QUEUE' });
                    }
                }
                //queue is inactive
                else if(result == false){
                    res.status(422).send({ error: "Queue '" + queue_id + "' is inactive", code: 'INACTIVE_QUEUE' });
                }
                else{
                    console.log('SJIADNAIDWND');
                }
            }
            //invalid customer id
            else if (!customeridvalidator) {
                res.status(errors.INVALID_BODY_CUSTOMER.status).send(errors.INVALID_BODY_CUSTOMER.body);
            }
            //invalid queue id
            else if (!queueIdValidator) {
                res.status(errors.INVALID_BODY_QUEUE.status).send(errors.INVALID_BODY_QUEUE.body);
            } else {
                res.status(errors.UNEXPECTED_SERVER_ERROR.status).send(errors.UNEXPECTED_SERVER_ERROR.body);
            }
        });
    }
});
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