const { reduceRight } = require('async');
const { Pool, Client } = require('pg')

function resetTables() {
    /**
     * return a promise that resolves when the database is successfully reset, and rejects if there was any error.
     */
    const client = new Client({
        user: 'achjwljb',
        host: 'john.db.elephantsql.com',//postgres://achjwljb:cQtUDm...@john.db.elephantsql.com:5432/achjwljb
        database: 'achjwljb',
        password: 'cQtUDmjqP_i_1jz4IkJ3MnsXw5TrwOQR',
        port: 5432,
    });
    client.connect();
    console.log('connecting to esql');
    const sql = `TRUNCATE TABLE Queue CASCADE;`;
    return new Promise(function (resolve, reject) {
        console.log('querrying')
        client.query(sql, function (err, res) {
            console.log('query send')
            if (err) return reject(err);
            else return resolve();
        });
    });
}

function getDatabasePool() {
    const pool = new Pool({
        user: 'achjwljb',
        host: 'john.db.elephantsql.com',//postgres://achjwljb:cQtUDm...@john.db.elephantsql.com:5432/achjwljb
        database: 'achjwljb',
        password: 'cQtUDmjqP_i_1jz4IkJ3MnsXw5TrwOQR',
        port: 5432,
    });
    return pool;
} 

function test(callback) {
    /**
     * return a promise that resolves when the database is successfully reset, and rejects if there was any error.
     */
    // const pool = getDatabasePool(); 
    console.log('connecting to esql')
    const sql = `Select * From Queue`;
    client.query(sql, function (err, res) {
        console.log('query send');
        if (err) {
            return callback(err, null);
        }
        else {
            return callback(null, res.rows);
        }
    });
}

function createQueue(company_id, queue_id, callback) {
    const pool = getDatabasePool(); 
    pool.connect((err, client, done) => {
        if (err) {
            console.log("Response from Database error: %j",err)
            console.log("err here..."+err);
            return callback(err, null);
        }
        else {
            const sql = 'INSERT INTO Queue(queue_id,current_queue_number, status, server_available,company_id)VALUES($1,$2,$3,$4,$5)';
            client.query(sql, [queue_id, 0, '0', '0', company_id], function (err, res) {
                console.log('query sent');
                console.log('insert data' + company_id + ' ' + queue_id);
                if (err) {
                    console.log(err);
                    return callback(err, null);
                }
                else {
                    const sql = 'SELECT * FROM Queue WHERE queue_id = $1';
                    client.query(sql, [queue_id], function (err, res) {
                        //End Database Connection
                        client.end();
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } else {
                            return callback(null, res.rows);
                        }
                    });
                }
            });
        }
    });
}

function updateQueue(status, queue_id, callback) {
    const pool = getDatabasePool(); 
    pool.connect((err, client, done) => {
        if (err) {
            console.log(err);
            return callback(err, null);
        }
        else {
            const sql = 'UPDATE Queue SET status = $1 WHERE queue_id = $2';
            console.log('UPDATE Queue SET status =' + status + 'WHERE queue_id=' + queue_id);
            client.query(sql, [status, queue_id], function (err, res) {
                console.log('query sent');
                // console.log("Response from Database res: %j",res)
                if (err) {
                    console.log(err);
                    return callback(err, null);
                }
                else {
                    const sql = 'SELECT queue_id FROM Queue WHERE queue_id = $1';
                    client.query(sql, [queue_id], function (err, res) {
                        // console.log("Response from Database res: %j",res) 
                        done();
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } else {
                            return callback(null, res.rows);
                        }
                    });
                }
            });
        }
    });
}

function serverAvailable(queue_id, callback) {
    const client = new Client({
        user: 'achjwljb',
        host: 'john.db.elephantsql.com',
        database: 'achjwljb',
        password: 'cQtUDmjqP_i_1jz4IkJ3MnsXw5TrwOQR',
        port: 5432,
    });

    var selectedResult;

    client.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err, null);
        }
        else {
            const sql = 'UPDATE Queue SET server_available = $1 WHERE queue_id = $2';
            console.log('UPDATE Queue SET server_available = $1 WHERE queue_id=' + queue_id);
            client.query(sql, ['1', queue_id], function (err, res) {
                console.log("Response from Database 1: %j", res)
                console.log('query sent');
                // throw Error('Something bad has happened');
                if (err) {
                    console.log('err here!' + err);
                    return callback(err, null);
                }
                else if (res.rowCount == 0) {
                    console.log('no such queue in database...');
                    return callback(null, 'UNKNOWN_QUEUE');
                }
                else {
                    console.log('parsing to select statement...');
                    const sql = 'SELECT C.customer_id FROM CustomerQueueNumber C, Queue Q where q.queue_id = $1 and Q.queue_id = C.queue_id and c.queue_number = q.current_queue_number+1';
                    client.query(sql, [queue_id], function (err, res) {
                        console.log("Response from Database 2: %j", res)
                        if (err) {
                            console.log('err2 here!' + err);
                            return callback(err, null);
                        } else {
                            console.log('result here..' + res.rows);
                            selectedResult = res.rows;

                            const sql = 'UPDATE Queue SET current_queue_number = current_queue_number+1 WHERE queue_id = $1';
                            client.query(sql, [queue_id], function (err, res) {
                                if (err) {
                                    console.log('err here!' + err);
                                    return callback(err, null);
                                }
                                else{
                                    return callback(null, selectedResult);
                                }
                        });
                    }
                    });
                }
            });
        }
    });
}

function checkQueue(queue_id,customer_id,callback){
    const pool = getDatabasePool();
    pool.connect((err, client, done)=>{
        if(err) {
            console.log(err);
            return callback(err,null);
        }
        else{
            const sql= 'Select count(queue_number) total FROM CustomerQueueNumber WHERE queue_id=$1';
            client.query(sql, [queue_id], function (err, res) {
                if (err) {
                    console.log(err);
                    return callback(err, null);
                } else {
                    const r1=res.rows[0];
                    const sql= 'Select current_queue_number,status FROM Queue WHERE queue_id=$1';
                    client.query(sql,[queue_id], function(err,res) {
                        if(err){
                            console.log(err);
                            return callback(err,null);
                        }else{
                            const r2 = res.rows[0];
                            const result= Object.assign(r1,r2);
                            if(customer_id==undefined){
                                console.log(result)
                                client.end();
                                return callback(null,result);
                            }
                            else{
                                const sql= 'Select queue_number FROM CustomerQueueNumber WHERE queue_id=$1 AND customer_id=$2';
                                client.query(sql,[queue_id,customer_id], function(err,res) {
                                    client.end();
                                    if(err){
                                        console.log(err);
                                        return callback(err,null);
                                    } else{
                                        const r3 = res.rows[0];
                                        result2= Object.assign(result,r3);
                                        console.log(result2);
                                        return callback(null,result);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    });
}

function joinQueue(customer_id, queue_id, callback) { 
    const pool = getDatabasePool();
    pool.connect((err,client,done)=>{ 
        if (err) {
            console.log(err);
            return callback(err, null);
        }
        else{
            // check if queue is active or not
            const sql = 'SELECT status FROM Queue WHERE queue_id=$1';
            client.query(sql, [queue_id], function (err, res) {
                if (err) {
                    console.log(err);
                    return callback(err, null);
                }
                else {
                    console.log(res.rows)
                    //queue does exist
                    if(res.rows != ''){
                        //queue active
                        if(res.rows[0].status == true){
                            //check if customer already joined queue
                            const sql= 'SELECT queue_number FROM CustomerQueueNumber WHERE queue_id=$1 AND customer_id=$2'//INSERT INTO CustomerQueueNumber(queue_number) VALUES (MAX(queue_number)+1) WHERE
                            client.query(sql,[queue_id,customer_id], function(err,res){
                                console.log('test'+res.rows +'test')
                                if(err){
                                    console.log(err);
                                    return callback(err,null);
                                }
                                //if customer not in queue
                                else if (res.rows == ''){
                                    console.log('customer not in queue '+res.rows)
                                    const sql= 'INSERT INTO CustomerQueueNumber(queue_number,customer_id) VALUES (MAX(queue_number)+1,$1) WHERE queue_id=$2';
                                    client.query(sql,[customer_id,queue_id], function(err,res){
                                        done();
                                        if(err){
                                            console.log(err);
                                            return callback(err,null);
                                        }
                                        else{
                                            console.log('Success');
                                            return callback(null,'SUCCESS');
                                        }
                                    });
                                }
                                else{
                                    done();
                                    console.log('Customer already in queue');
                                    return callback(null,'EXIST');
                                }
                            });
                        }
                        else if (res.rows[0].status == false){
                            // queue inactive return false
                            console.log('Inactive queue');
                            return callback(null,false);
                        }
                    }
                    else{
                        done();
                        return callback(null,'NOEXSIT')
                    }
                }
            });
        } 
    });
}

function closeDatabaseConnections() {
    /**
     * return a promise that resolves when all connection to the database is successfully closed, and rejects if there was any error.
     */
}

module.exports = {
    resetTables,
    closeDatabaseConnections,
    test,
    createQueue,
    updateQueue,
    serverAvailable,
    checkQueue,
    joinQueue,
};