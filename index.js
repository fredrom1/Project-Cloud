// index.js
var express = require('express');
var cors = require('cors');
const mysql = require('mysql2');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

var app = express();

app.use(cors());

// Set the view engine to use EJS
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Define route for homepage
app.get('/', function(req, res, next){
    // Query to get attractions from database
    pool.query('SELECT * FROM attractions', function(err, results) {
        if (err) throw err;
        // Render the 'index' view with the attractions data
        res.render('index', { attractions: results });
    });
});

app.listen(3000, function() {
    console.log('web server listening on port 3000');
});
