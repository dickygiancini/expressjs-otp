var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    database: 'nodejs-crud',
    user: 'root',
    password: 'password'
})

connection.connect((error) => {
    if(!!error)
    {
        console.log('Error Connecting to Database');
    }
})

module.exports = connection;