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
  console.log('connecting to esql')
  const sql = `TRUNCATE TABLE Queue;`;
  return new Promise(function(resolve,reject){
    console.log('querrying')
    client.query(sql,function(err, res) {
      console.log('query send')
      if(err) return reject(err);
      else return resolve();
    });
  });
}

function test(callback) {
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
  console.log('connecting to esql')
  const sql = `Select * From Queue`;
  client.query(sql,function(err, res) {
    console.log('query send')
    if(err){
      return callback(err,null);
    }
    else{
      return callback(null,res.rows);
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
    test
};
