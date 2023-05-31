const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employee_db',
};

const connection = mysql.createConnection(dbConfig);

module.exports = connection;