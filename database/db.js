const mysql = require('mysql');

/* variables de entorno */
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DATABASE
})

connection.connect((err) => {
    if(err) throw err;
    console.log('connection to database')
})

module.exports = connection;