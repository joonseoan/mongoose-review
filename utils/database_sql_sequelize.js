// sequelize : findById => findByPk() 

// connection setup
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { mysql_key } = require('../config/keys')

// intantiate Sequelize class library to be a database, 'node_complete'.
// In order to use another database, we need to uniqely intantiate this calss again
const sequelize = new Sequelize('node_complete', 'root', mysql_key, { 
    // this is an option for mysql2 to be set
    //  because there are different sql out there.
    dialect: 'mysql',
    // default is 'localhost'. not required to explitly specify it.
    host: 'localhost',
    operatorsAliases: Op
});

module.exports = sequelize;

// only with mysql2 library
// const mysql = require('mysql2');

// const { mysql_key } = require('../config/keys');

// const pool = mysql.createPool({
//     host: 'localhost', // connection proxy
//     user: 'root', // user name in mysql
//     database: 'node_complete', // database name we set
//     password: mysql_key
// });

// module.exports = pool.promise();