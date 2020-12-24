const session = require('express-session');
const mysqlSession = require('connect-mysql2')(session);
const db = require('./db');
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'web',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

module.exports = session({
    store: new mysqlSession({
        pool: pool
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 84600 * 1000 }
});